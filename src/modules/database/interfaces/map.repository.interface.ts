import type { Map } from '@common/types/map.type'

export interface MapRepositoryInterface {
	upsertMany(maps: Map[]): Promise<Map[]>
}
