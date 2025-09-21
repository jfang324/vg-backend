import { Logger } from '@nestjs/common'
import { AxiosError } from 'axios'
import { LoggingService } from './logging.service'

jest.mock('@nestjs/common', () => ({
	Logger: jest.fn().mockImplementation(() => ({
		log: jest.fn(),
		error: jest.fn()
	})),
	Injectable: jest.fn()
}))

describe('LoggingService', () => {
	let mockLogger: Logger
	let loggingService: LoggingService

	beforeEach(() => {
		mockLogger = new Logger()
		loggingService = new LoggingService(mockLogger)
	})

	it('should log log the message', () => {
		const message = 'test message'
		const spy = jest.spyOn(mockLogger, 'log')

		loggingService.logInfo(message)

		expect(spy).toHaveBeenCalledWith(message)
	})

	it('should log the error message and status code', () => {
		const serviceName = 'test service'
		const apiError = new AxiosError('test error', '500')
		const spy = jest.spyOn(mockLogger, 'error')

		loggingService.logApiError(serviceName, apiError)

		expect(spy).toHaveBeenCalledWith(expect.stringContaining(serviceName))
		expect(spy).toHaveBeenCalledWith(expect.stringContaining(apiError.message))
	})

	it('should log the error message and data source', () => {
		const dataSource = 'test data source'
		const error = 'test error'
		const spy = jest.spyOn(mockLogger, 'error')

		loggingService.logValidationError(dataSource, error)

		expect(spy).toHaveBeenCalledWith(expect.stringContaining(dataSource))
		expect(spy).toHaveBeenCalledWith(expect.stringContaining(error))
	})
})
