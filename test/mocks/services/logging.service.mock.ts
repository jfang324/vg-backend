import { LoggingService } from '@modules/logging/logging.service'

export const mockLoggingService: jest.Mocked<LoggingService> = {
	logInfo: jest.fn(),
	logValidationError: jest.fn(),
	logDatabaseError: jest.fn()
} as unknown as jest.Mocked<LoggingService>

jest.mock('@modules/logging/logging.service', () => ({
	LoggingService: jest.fn().mockImplementation(() => ({
		logInfo: jest.fn(),
		logValidationError: jest.fn(),
		logDatabaseError: jest.fn()
	}))
}))
