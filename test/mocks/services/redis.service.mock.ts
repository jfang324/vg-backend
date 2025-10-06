import { RedisService } from '@modules/redis/redis.service'

export const mockRedisService: jest.Mocked<RedisService> = {
	onModuleInit: jest.fn(),
	setProfileCache: jest.fn(),
	getProfileCache: jest.fn()
} as unknown as jest.Mocked<RedisService>

jest.mock('@modules/redis/redis.service', () => ({
	RedisService: jest.fn(() => mockRedisService)
}))
