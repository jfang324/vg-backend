import { Affinities, DefaultApi, ModesApi, Platforms } from '@generated/openapi/api-client'
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
	 * Retrieves matches from the HenrikDev API with the provided parameters
	 */
	async getRecentMatches(region: string, platform: string, name: string, tag: string, mode: string, limit: number) {
		return this.generatedClient.valorantV4MatchesRegionPlatformNameTagGet(
			name,
			tag,
			region as Affinities,
			platform as Platforms,
			mode as ModesApi,
			undefined,
			limit
		)
	}

	/**
	 * Retrieves stored matches from the HenrikDev API with the provided parameters
	 */
	async getStoredMatches(region: string, name: string, tag: string, mode: string, page: number, limit: number) {
		return this.generatedClient.valorantV1StoredMatchesRegionNameTagGet(
			region as Affinities,
			name,
			tag,
			mode as ModesApi,
			undefined,
			page,
			limit
		)
	}

	/**
	 * Retrieves a match from the HenrikDev API with the provided parameters and transforms the data into a more usable format
	 */
	async getMatchByIdAndRegion(id: string, region: string) {
		return this.generatedClient.valorantV4MatchRegionMatchidGet(id, region as Affinities)
	}
}
