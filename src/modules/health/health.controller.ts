import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	@ApiOperation({ summary: 'Check the health of the API' })
	@ApiResponse({
		status: 200,
		description: 'A basic message indicating API version and mode',
		schema: {
			type: 'string',
			example: 'VG Backend version 1.0 is running in development mode'
		}
	})
	healthCheck(): string {
		return this.healthService.healthCheck()
	}
}
