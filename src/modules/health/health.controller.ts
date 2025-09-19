import { DevGuard } from '@common/guards/dev.guard'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	@UseGuards(DevGuard)
	getHello(): string {
		return this.healthService.healthCheck()
	}
}
