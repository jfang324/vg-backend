import { Injectable } from '@nestjs/common'
import { HenrikDevClient } from './henrik-dev.client'

@Injectable()
export class HenrikDevService {
	constructor(private readonly henrikDevClient: HenrikDevClient) {}

	async sayHello() {
		return await this.henrikDevClient.sayHello()
	}
}
