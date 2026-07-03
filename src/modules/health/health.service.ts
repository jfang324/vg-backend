import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service that provides health check functionality
 */
@Injectable()
export class HealthService {
	constructor(private readonly configService: ConfigService) {}

	healthCheck() {
		return `VG Backend version ${this.configService.get('DEFAULT_VERSION')} is running in ${this.configService.get('NODE_ENV')} mode`
	}
}
