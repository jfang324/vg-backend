import { HenrikDevService } from '@integrations/henrik-dev/henrik-dev.service'
import { mockRecentmatchesData } from '../data/recent-matches.mock'
import { mockStoredMatchesData } from '../data/stored-matches.mock'

export const mockHenrikDevService: jest.Mocked<HenrikDevService> = {
	getRecentMatches: jest.fn().mockResolvedValue(mockRecentmatchesData),
	getStoredMatches: jest.fn().mockResolvedValue(mockStoredMatchesData)
} as unknown as jest.Mocked<HenrikDevService>

jest.mock('@integrations/henrik-dev/henrik-dev.service', () => ({
	HenrikDevService: jest.fn().mockImplementation(() => mockHenrikDevService)
}))
