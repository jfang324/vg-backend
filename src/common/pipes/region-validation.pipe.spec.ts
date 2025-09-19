import { DEFAULT_REGION, VALID_REGIONS } from '@common/constants/regions'
import { RegionValidationPipe } from '@common/pipes/region-validation.pipe'
import { BadRequestException } from '@nestjs/common'

describe('RegionValidationPipe', () => {
	let pipe: RegionValidationPipe

	beforeEach(() => {
		pipe = new RegionValidationPipe()
	})

	it('should return the region if it is valid', () => {
		const numberOfRegions = VALID_REGIONS.length
		const randomIndex = Math.floor(Math.random() * numberOfRegions)
		const randomValidRegion = VALID_REGIONS[randomIndex]

		expect(pipe.transform(randomValidRegion)).toBe(randomValidRegion)
	})

	it('should throw a BadRequestException if the region is not valid', () => {
		const invalidRegion = 'invalid-region'

		expect(() => pipe.transform(invalidRegion)).toThrow(BadRequestException)
	})

	it('should return the default region if no region is provided', () => {
		const defaultRegion = DEFAULT_REGION

		expect(pipe.transform()).toBe(defaultRegion)
	})
})
