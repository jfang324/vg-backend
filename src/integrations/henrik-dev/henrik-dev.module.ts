import { Module } from '@nestjs/common'
import { HenrikDevClient } from './henrik-dev.client'
import { HenrikDevService } from './henrik-dev.service'

@Module({
	providers: [HenrikDevService, HenrikDevClient],
	exports: [HenrikDevService]
})
export class HenrikDevModule {}
