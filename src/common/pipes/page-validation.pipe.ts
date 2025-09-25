import { BadRequestException, PipeTransform } from '@nestjs/common'

/**
 * Pipe to validate the page query parameter
 */
export class PageValidationPipe implements PipeTransform {
	transform(value?: string): number {
		if (!value) {
			return 1
		}

		const page = parseInt(value)

		if (isNaN(page) || page < 1) {
			throw new BadRequestException('Page must be a positive integer')
		}

		return page
	}
}
