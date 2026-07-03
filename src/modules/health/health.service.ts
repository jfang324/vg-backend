import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * Service that provides health check functionality
 */
@Injectable()
export class HealthService {
	constructor(private readonly configService: ConfigService) {}

	healthCheck() {
		const currentVersion = this.configService.get<string>('DEFAULT_VERSION', 'unknown')
		const currentEnvironment = this.configService.get<string>('NODE_ENV', 'development')

		return `VG Backend version ${currentVersion} is running in ${currentEnvironment} mode`
	}
}
