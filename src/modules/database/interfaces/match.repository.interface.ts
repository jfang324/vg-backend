import { Match } from '@common/types/match.type'

export interface MatchRepositoryInterface {
	upsertMany(matches: Match[]): Promise<Match[]>
	getById(id: string): Promise<Match | null>
}
