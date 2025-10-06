import { Mode } from '@common/types/mode.type'

export interface ModeRepositoryInterface {
	upsertMany(modes: Mode[]): Promise<Mode[]>
	getByName(name: string): Promise<Mode>
	getById(id: string): Promise<Mode | null>
}
