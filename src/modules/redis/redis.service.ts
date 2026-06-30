import { LoggingService } from '@modules/logging/logging.service'
import { Injectable, OnApplicationShutdown } from '@nestjs/common'
import { createClient, RedisClientType } from 'redis'
import { RedisConnectionError, RedisInitError } from './redis.errors'

@Injectable()
export class RedisService implements OnApplicationShutdown {
	private readonly client: RedisClientType

	constructor(private readonly loggingService: LoggingService) {
		const username = process.env.REDIS_USERNAME
		const password = process.env.REDIS_PASSWORD
		const host = process.env.REDIS_HOST
		const port = Number(process.env.REDIS_PORT)

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
		await this.client.disconnect()
	}

	async setProfileCache(region: string, platform: string, name: string, tag: string, mode: string, assets: string[]): Promise<void> {
		const key = `region:${region}platform:${platform}name:${name}tag:${tag}mode:${mode}`

		try {
			await this.client.sAdd(key, assets)
			await this.client.expire(key, 60)
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError(
					`SET key: ${key}`,
					error.message
				)
			}
		}
	}

	async getProfileCache(region: string, platform: string, name: string, tag: string, mode: string): Promise<string[]> {
		const key = `region:${region}platform:${platform}name:${name}tag:${tag}mode:${mode}`

		try {
			const assets = await this.client.sMembers(key)

			return assets
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError(
					`GET key: ${key}`,
					error.message
				)
			}

			return []
		}
	}
}
