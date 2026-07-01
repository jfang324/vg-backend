import { Injectable, Logger } from '@nestjs/common'

/**
 * Simple logging service for standardized logging format
 */
@Injectable()
export class LoggingService {
	private readonly logger = new Logger(LoggingService.name)

	logInfo(message: string) {
		this.logger.log(message)
	}

	logError(message: string) {
		this.logger.error(message)
	}

	logApiError(caller: string, api: string, error: Error) {
		this.logger.error(`call to ${api} by ${caller} failed with message [${error.message}]`)
	}

	logValidationError(caller: string, dataSource: string, error: Error) {
		this.logger.error(`${caller} failed to validate data from ${dataSource} with error [${error.message}]`)
	}

	logDatabaseError(caller: string, repository: string, operation: string, error: Error) {
		this.logger.error(`${caller} failed to ${operation} for ${repository} repository with error [${error.message}]`)
	}

	logRedisError(caller: string, source: string, operation: string, error: Error) {
		this.logger.error(`${caller} failed to ${operation} for ${source} with error [${error.message}]`)
	}
}
