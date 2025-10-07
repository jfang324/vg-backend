import { mockAgents } from '@mocks/data/agents.mock'
import { mockMaps } from '@mocks/data/maps.mock'
import { mockMatchPerformances } from '@mocks/data/match-performances.mock'
import { mockMatches } from '@mocks/data/matches.mock'
import { mockModes } from '@mocks/data/modes.mock'
import { mockPerformances } from '@mocks/data/performances.mock'
import { mockPlayers } from '@mocks/data/players.mock'
import { mockAgentRepository } from '@mocks/repositories/agent.repository.mock'
import { mockMapRepository } from '@mocks/repositories/map.repository.mock'
import { mockMatchRepository } from '@mocks/repositories/match.repository.mock'
import { mockModeRepository } from '@mocks/repositories/mode.repository.mock'
import { mockPerformanceRepository } from '@mocks/repositories/performance.repository.mock'
import { mockPlayerRepository } from '@mocks/repositories/player.repository.mock'
import { mockHenrikDevService } from '@mocks/services/henrik-dev.service.mock'
import { mockLoggingService } from '@mocks/services/logging.service.mock'
import { AxiosError } from 'axios'
import { MatchesService } from './matches.service'

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

jest.mock('@modules/logging/logging.service', () => ({
	LoggingService: jest.fn(() => mockLoggingService)
}))

function flushPromises() {
	return new Promise((resolve) => setImmediate(resolve))
}

describe('MatchesService', () => {
	let matchService: MatchesService

	beforeEach(() => {
		matchService = new MatchesService(
			mockHenrikDevService,
			mockMapRepository,
			mockAgentRepository,
			mockMatchRepository,
			mockModeRepository,
			mockPlayerRepository,
			mockPerformanceRepository,
			mockLoggingService
		)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should retrieve performance data from database repositories if they are cached', async () => {
		const mockMatch = mockMatches[0]
		const mockMode = mockModes[0]
		const mockMap = mockMaps[0]
		mockMatchRepository.getById.mockResolvedValueOnce(mockMatch)
		mockPerformanceRepository.getByMatchId.mockResolvedValueOnce(mockPerformances)
		mockMapRepository.getById.mockResolvedValueOnce(mockMap)
		mockModeRepository.getById.mockResolvedValueOnce(mockMode)
		mockAgentRepository.getManyByIds.mockResolvedValueOnce(mockAgents)
		mockPlayerRepository.getManyByIds.mockResolvedValueOnce(mockPlayers)

		await matchService.getMatch(mockMatch.id, 'na')

		await flushPromises()
		await flushPromises()

		expect(mockMatchRepository.getById).toHaveBeenCalledWith(mockMatch.id)
		expect(mockPerformanceRepository.getByMatchId).toHaveBeenCalledWith(mockMatch.id)
		expect(mockMapRepository.getById).toHaveBeenCalledWith(mockMatch.mapId)
		expect(mockModeRepository.getById).toHaveBeenCalledWith(mockMatch.modeId)
		expect(mockAgentRepository.getManyByIds).toHaveBeenCalledWith(
			mockPerformances.map((performance) => performance.agentId)
		)
	})

	it('should retrieve performance data from HenrikDev API if they are not cached', async () => {
		const mockMatch = mockMatches[0]
		mockMatchRepository.getById.mockResolvedValueOnce(null)
		mockHenrikDevService.getMatchByIdAndRegion.mockResolvedValueOnce(mockMatchPerformances)

		await matchService.getMatch(mockMatch.id, 'na')
		const { match, players, performances, maps, agents, modes } = mockMatchPerformances

		await flushPromises()
		await flushPromises()

		expect(mockMatchRepository.getById).toHaveBeenCalledWith(mockMatch.id)
		expect(mockHenrikDevService.getMatchByIdAndRegion).toHaveBeenCalledWith(mockMatch.id, 'na')
		expect(mockMapRepository.upsertMany).toHaveBeenCalledWith(maps)
		expect(mockAgentRepository.upsertMany).toHaveBeenCalledWith(agents)
		expect(mockModeRepository.upsertMany).toHaveBeenCalledWith(modes)
		expect(mockMatchRepository.upsertMany).toHaveBeenCalledWith([
			{
				...match,
				date: new Date(match.date)
			}
		])
		expect(mockPlayerRepository.upsertMany).toHaveBeenCalledWith(players)
		expect(mockPerformanceRepository.upsertMany).toHaveBeenCalledWith(performances)
	})

	it('should throw an error if the HenrikDev API returns an error', async () => {
		const mockMatch = mockMatches[0]
		mockHenrikDevService.getMatchByIdAndRegion.mockRejectedValueOnce(new AxiosError('User not found', '404'))

		try {
			await matchService.getMatch(mockMatch.id, 'na')
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(AxiosError)

			if (error instanceof AxiosError) {
				expect(error.code).toBe('404')
				expect(error.message).toBe('User not found')
			}
		}

		expect(mockHenrikDevService.getMatchByIdAndRegion).toHaveBeenCalledWith(mockMatch.id, 'na')
	})

	it('should throw an error if the HenrikDev API returns a 403 error', async () => {
		const mockMatch = mockMatches[0]
		mockHenrikDevService.getMatchByIdAndRegion.mockRejectedValueOnce(new AxiosError('Forbidden', '403'))

		try {
			await matchService.getMatch(mockMatch.id, 'na')
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(AxiosError)

			if (error instanceof AxiosError) {
				expect(error.code).toBe('403')
				expect(error.message).toBe('Forbidden')
			}
		}

		expect(mockHenrikDevService.getMatchByIdAndRegion).toHaveBeenCalledWith(mockMatch.id, 'na')
	})
})
