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
	 * Logs a formatted error message related to an API call using the NestJS Logger
	 *
	 * @param serviceName - The name of the service that the error occurred in
	 * @param error - The error object
	 */
	logApiError(serviceName: string, error: AxiosError) {
		this.logger.error(
			`Call to ${serviceName} failed with status code ${error.response?.status} and message [${error.message}]`
		)
	}

	/**
	 * Logs a formatted error message related to a validation error using the NestJS Logger
	 *
	 * @param dataSource - The name of the data source that the error occurred in
	 * @param error - The error message
	 */
	logValidationError(dataSource: string, error: string) {
		this.logger.error(`Failed to validate data from ${dataSource} with error [${error}]`)
	}

	/**
	 * Logs a formatted error message related to a database error using the NestJS Logger
	 *
	 * @param repository - The name of the repository that the error occurred in
	 * @param error - The error message
	 */
	logDatabaseError(repository: string, error: string) {
		this.logger.error(`Failed to save data to database for ${repository} repository with error [${error}]`)
	}
}
