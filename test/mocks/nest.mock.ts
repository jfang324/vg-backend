export const mockLogger = {
	log: jest.fn(),
	error: jest.fn()
}

jest.mock('@nestjs/common', () => ({
	Injectable: () => () => {},
	Logger: jest.fn(() => mockLogger)
}))
