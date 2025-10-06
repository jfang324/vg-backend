import { Player } from '@common/types/player.type'

export interface PlayerRepositoryInterface {
	upsertMany(players: Player[]): Promise<Player[]>
	getById(id: string): Promise<Player>
	getManyByIds(ids: string[]): Promise<Player[]>
}
