import { mockLogger } from '@mocks/nest/nest.mock'
import { Logger } from '@nestjs/common'
import { AxiosError } from 'axios'
import { LoggingService } from './logging.service'

describe('LoggingService', () => {
	let loggingService: LoggingService

	beforeEach(() => {
		loggingService = new LoggingService(new Logger())
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should log log the message', () => {
		const message = 'test message'
		loggingService.logInfo(message)

		expect(mockLogger.log).toHaveBeenCalledWith(message)
	})

	it('should log the error message and status code', () => {
		const serviceName = 'test service'
		const apiError = new AxiosError('test error', '500')

		loggingService.logApiError(serviceName, apiError)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(serviceName))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(apiError.message))
	})

	it('should log the error message and data source', () => {
		const dataSource = 'test data source'
		const error = 'test error'

		loggingService.logValidationError(dataSource, error)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(dataSource))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(error))
	})

	it('should log the error message and repository', () => {
		const repository = 'test repository'
		const operation = 'test operation'
		const error = 'test error'

		loggingService.logDatabaseError(repository, operation, error)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(repository))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(operation))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(error))
	})

	it('should log the error message and source', () => {
		const source = 'test source'
		const error = 'test error'

		loggingService.logRedisError(source, error)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(source))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(error))
	})
})
