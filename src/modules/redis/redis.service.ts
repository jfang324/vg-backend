import { LoggingService } from '@modules/logging/logging.service'
import { Injectable } from '@nestjs/common'
import { createClient } from 'redis'

@Injectable()
export class RedisService {
	private readonly client: ReturnType<typeof createClient>

	constructor(private readonly loggingService: LoggingService) {
		try {
			const username = process.env.REDIS_USERNAME
			const password = process.env.REDIS_PASSWORD
			const host = process.env.REDIS_HOST
			const port = Number(process.env.REDIS_PORT)

			if (!username || !password || !host || !port) {
				throw new Error('REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, and REDIS_PORT must be set')
			}

			this.client = createClient({
				username,
				password,
				socket: {
					host,
					port
				}
			})
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError('Connection', error.message)
			}
		}
	}

	/**
	 * On module init, connect to Redis and flush the database
	 */
	async onModuleInit() {
		try {
			await this.client.connect()
			await this.client.flushAll()
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError('Connection', error.message)
			}
		}
	}

	/**
	 * Set the cached assets for a player in Redis
	 * @param region The region of the player
	 * @param platform The platform of the player
	 * @param name The name of the player
	 * @param tag The tag of the player
	 * @param mode The mode of the player
	 * @param assets The assets to cache
	 */
	setProfileCache(region: string, platform: string, name: string, tag: string, mode: string, assets: string[]) {
		try {
			void this.client.sAdd(`region:${region}platform:${platform}name:${name}tag:${tag}mode:${mode}`, assets)
			void this.client.expire(`region:${region}platform:${platform}name:${name}tag:${tag}mode:${mode}`, 60)
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError(
					`SET Profile ${region}:${platform}:${name}:${tag}:${mode}`,
					error.message
				)
			}
		}
	}

	/**
	 * Get the cached assets for a player in Redis
	 * @param region The region of the player
	 * @param platform The platform of the player
	 * @param name The name of the player
	 * @param tag The tag of the player
	 * @param mode The mode of the player
	 * @returns The cached assets
	 */
	async getProfileCache(region: string, platform: string, name: string, tag: string, mode: string) {
		try {
			const assets = await this.client.sMembers(
				`region:${region}platform:${platform}name:${name}tag:${tag}mode:${mode}`
			)

			return assets || []
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.loggingService.logRedisError(
					`GET Profile ${region}:${platform}:${name}:${tag}:${mode}`,
					error.message
				)
			}
		}
	}
}
