export interface Technology {
	name: string
	image: string
	query?: string
	background?: 'light' | 'dark'
}

export type Technologies = Record<string, Record<string, Technology>>
