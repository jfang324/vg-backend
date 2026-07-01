import { mockLogger } from '@mocks/nest/nest.mock'
import { LoggingService } from './logging.service'

describe('LoggingService', () => {
	let loggingService: LoggingService

	beforeEach(() => {
		loggingService = new LoggingService()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should log the message', () => {
		const message = 'test message'
		loggingService.logInfo(message)

		expect(mockLogger.log).toHaveBeenCalledWith(message)
	})

	it('should log the error message and API context', () => {
		const caller = 'testCaller'
		const api = 'testApi'
		const error = new Error('test error')

		loggingService.logApiError(caller, api, error)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(caller))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(api))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(error.message))
	})

	it('should log the error message and validation context', () => {
		const caller = 'testCaller'
		const dataSource = 'test data source'
		const error = 'test error'

		loggingService.logValidationError(caller, dataSource, error)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(caller))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(dataSource))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(error))
	})

	it('should log the error message and database context', () => {
		const caller = 'testCaller'
		const repository = 'test repository'
		const operation = 'test operation'
		const error = 'test error'

		loggingService.logDatabaseError(caller, repository, operation, error)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(caller))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(repository))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(operation))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(error))
	})

	it('should log the error message and Redis context', () => {
		const caller = 'testCaller'
		const source = 'test source'
		const operation = 'testOperation'
		const error = 'test error'

		loggingService.logRedisError(caller, source, operation, error)

		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(caller))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(source))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(operation))
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(error))
	})
})
