import { PageValidationPipe } from '@common/pipes/page-validation.pipe'
import { BadRequestException } from '@nestjs/common'

describe('PageValidationPipe', () => {
	let pipe: PageValidationPipe

	beforeEach(() => {
		pipe = new PageValidationPipe()
	})

	it('should return the page if it is valid', () => {
		const numberOfPages = 10
		const randomIndex = Math.floor(Math.random() * numberOfPages)
		const randomPage = randomIndex + 1

		expect(pipe.transform(randomPage.toString())).toBe(randomPage)
	})

	it('should throw a BadRequestException if the page is not valid', () => {
		const invalidPage = 'invalid-page'

		expect(() => pipe.transform(invalidPage)).toThrow(BadRequestException)
	})

	it('should return 1 if no page is provided', () => {
		expect(pipe.transform()).toBe(1)
	})
})
