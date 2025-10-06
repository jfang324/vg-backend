import { mockRecentMatchesData } from '@mocks/data/recent-matches.mock'
import { mockAgentRepository } from '@mocks/repositories/agent.repository.mock'
import { mockMapRepository } from '@mocks/repositories/map.repository.mock'
import { mockMatchRepository } from '@mocks/repositories/match.repository.mock'
import { mockMode, mockModeRepository } from '@mocks/repositories/mode.repository.mock'
import { mockPerformanceRepository } from '@mocks/repositories/performance.repository.mock'
import { mockPlayer, mockPlayerRepository } from '@mocks/repositories/player.repository.mock'
import { mockHenrikDevService } from '@mocks/services/henrik-dev.service.mock'
import { mockLoggingService } from '@mocks/services/logging.service.mock'
import { mockRedisService } from '@mocks/services/redis.service.mock'
import { AxiosError } from 'axios'
import { PlayersService } from './players.service'

jest.mock('@integrations/henrik-dev/henrik-dev.service', () => ({
	HenrikDevService: jest.fn(() => mockHenrikDevService)
}))

jest.mock('@modules/database/supabase_repositories/agent.repository', () => ({
	AgentRepository: jest.fn(() => mockAgentRepository)
}))

jest.mock('@modules/database/supabase_repositories/map.repository', () => ({
	MapRepository: jest.fn(() => mockMapRepository)
}))

jest.mock('@modules/database/supabase_repositories/match.repository', () => ({
	MatchRepository: jest.fn(() => mockMatchRepository)
}))

jest.mock('@modules/database/supabase_repositories/mode.repository', () => ({
	ModeRepository: jest.fn(() => mockModeRepository)
}))

jest.mock('@modules/database/supabase_repositories/performance.repository', () => ({
	PerformanceRepository: jest.fn(() => mockPerformanceRepository)
}))

jest.mock('@modules/database/supabase_repositories/player.repository', () => ({
	PlayerRepository: jest.fn(() => mockPlayerRepository)
}))

jest.mock('@modules/redis/redis.service', () => ({
	RedisService: jest.fn(() => mockRedisService)
}))

//required to resolve fire-and-forget promises
function flushPromises() {
	return new Promise((resolve) => setImmediate(resolve))
}

describe('PlayersService', () => {
	let playerService: PlayersService

	beforeEach(() => {
		playerService = new PlayersService(
			mockHenrikDevService,
			mockMapRepository,
			mockAgentRepository,
			mockMatchRepository,
			mockModeRepository,
			mockPlayerRepository,
			mockPerformanceRepository,
			mockLoggingService,
			mockRedisService
		)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should get recent matches and cache performances and static data', async () => {
		mockHenrikDevService.getRecentMatches.mockResolvedValueOnce(mockRecentMatchesData as unknown as any)

		await playerService.getRecentMatches('na', 'pc', 'Hexennacht', 'NA1', 'competitive', 10)
		const { matches, players, performances, maps, agents, modes } = mockRecentMatchesData

		await flushPromises()
		await flushPromises()

		expect(mockHenrikDevService.getRecentMatches).toHaveBeenCalledWith(
			'na',
			'pc',
			'Hexennacht',
			'NA1',
			'competitive',
			10
		)
		expect(mockMapRepository.upsertMany).toHaveBeenCalledWith(maps)
		expect(mockAgentRepository.upsertMany).toHaveBeenCalledWith(agents)
		expect(mockModeRepository.upsertMany).toHaveBeenCalledWith(modes)
		expect(mockMatchRepository.upsertMany).toHaveBeenCalledWith(
			matches.map((match) => ({ ...match, date: new Date(match.date) }))
		)
		expect(mockPlayerRepository.upsertMany).toHaveBeenCalledWith(players)
		expect(mockPerformanceRepository.upsertMany).toHaveBeenCalledWith(performances)
	})

	it('should throw an error if the HenrikDev API returns an error', async () => {
		mockHenrikDevService.getRecentMatches.mockRejectedValue(new AxiosError('User not found', '404'))

		try {
			await playerService.getRecentMatches('na', 'pc', 'Hexennacht', 'NA1', 'competitive', 10)
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(AxiosError)

			if (error instanceof AxiosError) {
				expect(error.code).toBe('404')
				expect(error.message).toBe('User not found')
			}
		}

		expect(mockHenrikDevService.getRecentMatches).toHaveBeenCalledWith(
			'na',
			'pc',
			'Hexennacht',
			'NA1',
			'competitive',
			10
		)
	})

	it('should throw an error if the HenrikDev API returns a 403 error', async () => {
		mockHenrikDevService.getRecentMatches.mockRejectedValue(new AxiosError('Forbidden', '403'))

		try {
			await playerService.getRecentMatches('na', 'pc', 'Hexennacht', 'NA1', 'competitive', 10)
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(AxiosError)

			if (error instanceof AxiosError) {
				expect(error.code).toBe('403')
				expect(error.message).toBe('Forbidden')
			}
		}

		expect(mockHenrikDevService.getRecentMatches).toHaveBeenCalledWith(
			'na',
			'pc',
			'Hexennacht',
			'NA1',
			'competitive',
			10
		)
	})

	it('should return a list of stored matches', async () => {
		mockPlayerRepository.getById.mockResolvedValueOnce(mockPlayer)
		mockModeRepository.getByName.mockResolvedValueOnce(mockMode)

		const response = await playerService.getStoredMatches('na', 'Hexennacht', 'NA1', 'competitive', 1, 10)

		expect(mockHenrikDevService.getStoredMatches).toHaveBeenCalledWith(
			'na',
			'Hexennacht',
			'NA1',
			'competitive',
			1,
			10
		)
		expect(mockPlayerRepository.getById).toHaveBeenCalledWith('8918b04d-9034-5838-b3ed-dd7ae3efe5e5')
		expect(mockModeRepository.getByName).toHaveBeenCalledWith('Competitive')
		expect(response.data.player.id).toEqual(mockPlayer.id)
	})

	it('should throw an error if the HenrikDev API returns an error', async () => {
		mockHenrikDevService.getStoredMatches.mockRejectedValueOnce(new AxiosError('User not found', '404'))

		try {
			await playerService.getStoredMatches('na', 'Hexennacht', 'NA1', 'competitive', 1, 10)
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(AxiosError)

			if (error instanceof AxiosError) {
				expect(error.code).toBe('404')
				expect(error.message).toBe('User not found')
			}
		}

		expect(mockHenrikDevService.getStoredMatches).toHaveBeenCalledWith(
			'na',
			'Hexennacht',
			'NA1',
			'competitive',
			1,
			10
		)
	})

	it('should throw an error if the HenrikDev API returns a 403 error', async () => {
		mockHenrikDevService.getStoredMatches.mockRejectedValueOnce(new AxiosError('Forbidden', '403'))

		try {
			await playerService.getStoredMatches('na', 'Hexennacht', 'NA1', 'competitive', 1, 10)
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(AxiosError)

			if (error instanceof AxiosError) {
				expect(error.code).toBe('403')
				expect(error.message).toBe('Forbidden')
			}
		}

		expect(mockHenrikDevService.getStoredMatches).toHaveBeenCalledWith(
			'na',
			'Hexennacht',
			'NA1',
			'competitive',
			1,
			10
		)
	})

	it('should get cached assets if they exist', async () => {
		mockRedisService.getProfileCache.mockResolvedValueOnce(['https://media.valorant-api.com/maps/1/splash.png'])

		const response = await playerService.getCachedAssets('na', 'pc', 'Hexennacht', 'NA1', 'competitive')

		expect(mockRedisService.getProfileCache).toHaveBeenCalledWith('na', 'pc', 'Hexennacht', 'NA1', 'competitive')
		expect(response).toEqual(['https://media.valorant-api.com/maps/1/splash.png'])
	})

	it('should return an empty array if cached assets do not exist', async () => {
		mockRedisService.getProfileCache.mockResolvedValueOnce([])

		const response = await playerService.getCachedAssets('na', 'pc', 'Hexennacht', 'NA1', 'competitive')

		expect(mockRedisService.getProfileCache).toHaveBeenCalledWith('na', 'pc', 'Hexennacht', 'NA1', 'competitive')
		expect(response).toEqual([])
	})
})
