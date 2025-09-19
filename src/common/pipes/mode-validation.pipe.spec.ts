import { DEFAULT_MODE, VALID_MODES } from '@common/constants/modes'
import { ModeValidationPipe } from '@common/pipes/mode-validation.pipe'
import { BadRequestException } from '@nestjs/common'

describe('ModeValidationPipe', () => {
	let pipe: ModeValidationPipe

	beforeEach(() => {
		pipe = new ModeValidationPipe()
	})

	it('should return the mode if it is valid', () => {
		const numberOfModes = VALID_MODES.length
		const randomIndex = Math.floor(Math.random() * numberOfModes)
		const randomValidMode = VALID_MODES[randomIndex]

		expect(pipe.transform(randomValidMode)).toBe(randomValidMode)
	})

	it('should throw a BadRequestException if the mode is not valid', () => {
		const invalidMode = 'invalid-mode'

		expect(() => pipe.transform(invalidMode)).toThrow(BadRequestException)
	})

	it('should return the default mode if no mode is provided', () => {
		const defaultMode = DEFAULT_MODE

		expect(pipe.transform()).toBe(defaultMode)
	})
})
