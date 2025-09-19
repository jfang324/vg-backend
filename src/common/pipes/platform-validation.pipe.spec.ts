import { DEFAULT_PLATFORM, VALID_PLATFORMS } from '@common/constants/platforms'
import { PlatformValidationPipe } from '@common/pipes/platform-validation.pipe'
import { BadRequestException } from '@nestjs/common'

describe('PlatformValidationPipe', () => {
	let pipe: PlatformValidationPipe

	beforeEach(() => {
		pipe = new PlatformValidationPipe()
	})

	it('should return the platform if it is valid', () => {
		const numberOfPlatforms = VALID_PLATFORMS.length
		const randomIndex = Math.floor(Math.random() * numberOfPlatforms)
		const randomValidPlatform = VALID_PLATFORMS[randomIndex]

		expect(pipe.transform(randomValidPlatform)).toBe(randomValidPlatform)
	})

	it('should throw a BadRequestException if the platform is not valid', () => {
		const invalidPlatform = 'invalid-platform'

		expect(() => pipe.transform(invalidPlatform)).toThrow(BadRequestException)
	})

	it('should return the default platform if no platform is provided', () => {
		const defaultPlatform = DEFAULT_PLATFORM

		expect(pipe.transform()).toBe(defaultPlatform)
	})
})
