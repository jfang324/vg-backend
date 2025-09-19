import { DEFAULT_LIMIT, MAX_LIMIT, MIN_LIMIT } from '@common/constants/limits'
import { BadRequestException, PipeTransform } from '@nestjs/common'

/**
 * Pipe that validates the limit is valid
 */
export class LimitValidationPipe implements PipeTransform {
	transform(value?: string): number {
		if (!value) {
			return DEFAULT_LIMIT
		}

		const parsedValue = Number(value)

		if (Number.isNaN(parsedValue)) {
			throw new BadRequestException(`${value} is not a valid number`)
		}

		if (parsedValue > MAX_LIMIT) {
			throw new BadRequestException(`${value} is greater than the maximum limit of ${MAX_LIMIT}`)
		}

		if (parsedValue < MIN_LIMIT) {
			throw new BadRequestException(`${value} is less than the minimum limit of ${MIN_LIMIT}`)
		}

		return parsedValue
	}
}
