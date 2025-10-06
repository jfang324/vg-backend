import { Performance } from '@common/types/performance.type'

export interface PerformanceRepositoryInterface {
	upsertMany(performances: Performance[]): Promise<Performance[]>
	getByMatchId(matchId: string): Promise<Performance[]>
}
