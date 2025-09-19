import { DevGuard } from './dev.guard'

describe('DevGuard', () => {
	let guard: DevGuard
	const originalEnv = process.env.NODE_ENV

	beforeEach(() => {
		guard = new DevGuard()
	})

	afterEach(() => {
		process.env.NODE_ENV = originalEnv
	})

	it('should return true if in dev mode', () => {
		process.env.NODE_ENV = 'development'
		expect(guard.canActivate()).toBe(true)
	})

	it('should return false if not in dev mode', () => {
		process.env.NODE_ENV = 'production'
		expect(guard.canActivate()).toBe(false)
	})
})
