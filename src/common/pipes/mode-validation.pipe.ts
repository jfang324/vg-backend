import { DEFAULT_MODE, VALID_MODES } from '@common/constants/modes'
import { BadRequestException, PipeTransform } from '@nestjs/common'

/**
 * Pipe that validates the mode is supported by the HenrikDev API
 */
export class ModeValidationPipe implements PipeTransform {
	transform(value?: string) {
		if (!value) {
			return DEFAULT_MODE
		}

		if (!VALID_MODES.includes(value)) {
			throw new BadRequestException(`${value} is not a supported mode`)
		}

		return value
	}
}
