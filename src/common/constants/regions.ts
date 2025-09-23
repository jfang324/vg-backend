// regions are consistent with V4 of the HenrikDev API
export const VALID_REGIONS = ['na', 'eu', 'latam', 'br', 'ap', 'kr'] as const
export type Region = (typeof VALID_REGIONS)[number]

export const DEFAULT_REGION = 'na'
