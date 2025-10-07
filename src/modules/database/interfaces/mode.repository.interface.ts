import { Mode } from '@common/types/mode.type'

export interface ModeRepositoryInterface {
	upsertMany(modes: Mode[]): Promise<Mode[]>
	getByName(name: string): Promise<Mode | null>
	getById(id: string): Promise<Mode | null>
}
