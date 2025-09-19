import { DEFAULT_PLATFORM, VALID_PLATFORMS } from '@common/constants/platforms'
import { BadRequestException, PipeTransform } from '@nestjs/common'

/**
 * Pipe that validates the platform is supported by the HenrikDev API
 */
export class PlatformValidationPipe implements PipeTransform {
	transform(value?: string) {
		if (!value) {
			return DEFAULT_PLATFORM
		}

		if (!VALID_PLATFORMS.includes(value)) {
			throw new BadRequestException(`${value} is not a supported platform`)
		}

		return value
	}
}
