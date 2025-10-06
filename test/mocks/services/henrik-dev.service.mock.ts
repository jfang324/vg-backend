import { HenrikDevService } from '@integrations/henrik-dev/henrik-dev.service'
import { mockMatchPerformances } from '../data/match-performances.mock'
import { mockRecentMatchesData } from '../data/recent-matches.mock'
import { mockStoredMatchesData } from '../data/stored-matches.mock'

export const mockHenrikDevService: jest.Mocked<HenrikDevService> = {
	getRecentMatches: jest.fn().mockResolvedValue(mockRecentMatchesData),
	getStoredMatches: jest.fn().mockResolvedValue(mockStoredMatchesData),
	getMatchByIdAndRegion: jest.fn().mockResolvedValue(mockMatchPerformances)
} as unknown as jest.Mocked<HenrikDevService>

jest.mock('@integrations/henrik-dev/henrik-dev.service', () => ({
	HenrikDevService: jest.fn().mockImplementation(() => mockHenrikDevService)
}))
