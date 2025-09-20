import { Injectable, Logger } from '@nestjs/common'
import { AxiosError } from 'axios'

/**
 * Simple logging service for standardized logging format
 */
@Injectable()
export class LoggingService {
	constructor(private readonly logger: Logger) {}

	/**
	 * Logs a message using the NestJS Logger
	 *
	 * @param message - The message to log
	 */
	logInfo(message: string) {
		this.logger.log(message)
	}

	/**
	 * Logs a formatted error message using the NestJS Logger
	 *
	 * @param serviceName - The name of the service that the error occurred in
	 * @param error - The error object
	 */
	logApiError(serviceName: string, error: AxiosError) {
		this.logger.error(
			`Call to ${serviceName} failed with status code ${error.response?.status} and message [${error.message}]`
		)
	}
}
