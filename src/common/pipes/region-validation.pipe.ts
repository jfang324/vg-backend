import { DEFAULT_REGION, VALID_REGIONS } from '@common/constants/regions'
import { BadRequestException, PipeTransform } from '@nestjs/common'

/**
 * Pipe that validates the region is supported by the HenrikDev API
 */
export class RegionValidationPipe implements PipeTransform {
	transform(value?: string) {
		if (!value) {
			return DEFAULT_REGION
		}

		if (!VALID_REGIONS.includes(value as (typeof VALID_REGIONS)[number])) {
			throw new BadRequestException(`${value} is not a supported region`)
		}

		return value
	}
}
