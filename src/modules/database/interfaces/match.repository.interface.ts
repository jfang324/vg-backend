import { Match } from '@common/types/match.type'

export interface MatchRepositoryInterface {
	upsertMany(matches: Match[]): Promise<Match[]>
}
