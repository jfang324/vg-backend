import { BadRequestException } from '@nestjs/common'
import { NameTagValidationPipe } from './nametag-validation.pipe'

describe('NameTagValidationPipe', () => {
	let pipe: NameTagValidationPipe

	beforeEach(() => {
		pipe = new NameTagValidationPipe()
	})

	it('should return the nametag if it is valid', () => {
		const nameTag = 'Hexennacht#NA1'
		const [name, tag] = nameTag.split('#')

		expect(pipe.transform(nameTag)).toEqual({ name, tag })
	})

	it('should throw a BadRequestException if the nametag is not valid', () => {
		const invalidNameTag = 'invalid-nametag'

		expect(() => pipe.transform(invalidNameTag)).toThrow(BadRequestException)
	})
})
