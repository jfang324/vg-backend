import { BadRequestException, PipeTransform } from '@nestjs/common'

export interface NameTag {
	name: string
	tag: string
}

/**
 * Pipe that validates the nametag is valid
 */
export class NameTagValidationPipe implements PipeTransform {
	transform(value: string): NameTag {
		const [name, tag] = value.split('#')

		if (!name || !tag) {
			throw new BadRequestException(`${value} is not a valid nametag`)
		}

		return {
			name: name,
			tag: tag
		}
	}
}
