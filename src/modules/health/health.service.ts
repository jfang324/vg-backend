/**
 * Service that provides health check functionality
 */
export class HealthService {
	healthCheck() {
		return `VG Backend version ${process.env.DEFAULT_VERSION} is running in ${process.env.NODE_ENV} mode`
	}
}
