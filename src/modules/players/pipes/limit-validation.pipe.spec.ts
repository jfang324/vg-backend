import { DEFAULT_LIMIT, MAX_LIMIT, MIN_LIMIT } from '@common/constants/limits'
import { BadRequestException } from '@nestjs/common'
import { LimitValidationPipe } from './limit-validation.pipe'

describe('LimitValidationPipe', () => {
	let pipe: LimitValidationPipe

	beforeEach(() => {
		pipe = new LimitValidationPipe()
	})

	it('should return the limit if it is valid (max limit)', () => {
		const maxLimit = String(MAX_LIMIT)

		expect(pipe.transform(maxLimit)).toBe(MAX_LIMIT)
	})

	it('should return the limit if it is valid (min limit)', () => {
		const minLimit = String(MIN_LIMIT)

		expect(pipe.transform(minLimit)).toBe(MIN_LIMIT)
	})

	it('should return the default limit if no limit is provided', () => {
		expect(pipe.transform()).toBe(DEFAULT_LIMIT)
	})

	it('should throw a BadRequestException if the limit is not valid (over max limit)', () => {
		const invalidLimit = String(MAX_LIMIT + 1)

		expect(() => pipe.transform(invalidLimit)).toThrow(BadRequestException)
	})

	it('should throw a BadRequestException if the limit is not valid (under min limit)', () => {
		const invalidLimit = String(MIN_LIMIT - 1)

		expect(() => pipe.transform(invalidLimit)).toThrow(BadRequestException)
	})

	it('should throw a BadRequestException if the limit is not a number', () => {
		const invalidLimit = 'invalid-limit'

		expect(() => pipe.transform(invalidLimit)).toThrow(BadRequestException)
	})
})
