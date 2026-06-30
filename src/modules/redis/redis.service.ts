import { LoggingService } from '@modules/logging/logging.service'
import { Injectable, OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'
import { RedisConnectionError, RedisInitError } from './redis.errors'

@Injectable()
export class RedisService implements OnApplicationShutdown {
	private readonly client: RedisClientType

	constructor(
		private readonly configService: ConfigService,
		private readonly loggingService: LoggingService
	) {
		const username = this.configService.get<string>('REDIS_USERNAME')
		const password = this.configService.get<string>('REDIS_PASSWORD')
		const host = this.configService.get<string>('REDIS_HOST')
		const port = Number(this.configService.get<string>('REDIS_PORT'))

		if (!username || !password || !host || !port) {
			throw new RedisInitError('Redis service is not configured properly')
		}

		this.client = createClient({
			username,
			password,
			socket: {
				host,
				port
			}
		})
	}

	async onModuleInit() {
		try {
			await this.client.connect()
		} catch (error: unknown) {
			throw new RedisConnectionError('Failed to connect to Redis', { cause: error })
		}
	}

	async onApplicationShutdown() {
		// disconnect() can reject if the connection already closed at runtime
		try {
			await this.client.disconnect()
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError('Failed to disconnect from Redis', error.message)
			}
		}
	}

	private buildKey(region: string, platform: string, name: string, tag: string, mode: string): string {
		return `region:${region}platform:${platform}name:${name}tag:${tag}mode:${mode}`
	}

	async setProfileCache(
		region: string,
		platform: string,
		name: string,
		tag: string,
		mode: string,
		assets: string[]
	): Promise<void> {
		const key = this.buildKey(region, platform, name, tag, mode)

		try {
			await this.client.sAdd(key, assets)
			await this.client.expire(key, 60)
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError(`SET key: ${key}`, error.message)
			}
		}
	}

	async getProfileCache(
		region: string,
		platform: string,
		name: string,
		tag: string,
		mode: string
	): Promise<string[]> {
		const key = this.buildKey(region, platform, name, tag, mode)

		try {
			const assets = await this.client.sMembers(key)

			return assets
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError(`GET key: ${key}`, error.message)
			}

			return []
		}
	}
}
