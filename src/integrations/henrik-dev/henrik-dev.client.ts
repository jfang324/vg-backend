import { DefaultApi } from '@generated/openapi/api-client'
import { Injectable } from '@nestjs/common'
import type { AxiosInstance } from 'axios'

/**
 * Client for HenrikDev API
 */
@Injectable()
export class HenrikDevClient {
	private readonly generatedClient: DefaultApi

	constructor() {
		const apiKey = process.env.HENRIK_DEV_API_KEY
		this.generatedClient = new DefaultApi()

		if (!apiKey) {
			throw new Error('Missing API key for HenrikDev')
		}

		const axiosInstance = (this.generatedClient as unknown as { axios: AxiosInstance }).axios

		axiosInstance.interceptors.request.use((config) => {
			config.headers.Authorization = apiKey

			return config
		})
	}

    /**
     * Say hello to HenrikDev
     */
	async sayHello() {
		return this.generatedClient.valorantV4MatchesRegionPlatformNameTagGet(
			'Hexennacht',
			'NA1',
			'na',
			'pc',
			'competitive'
		)
	}
}
