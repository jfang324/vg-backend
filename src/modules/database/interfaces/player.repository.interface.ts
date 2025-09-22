import { Player } from '@common/types/player.type'

export interface PlayerRepositoryInterface {
	upsertMany(players: Player[]): Promise<Player[]>
}
