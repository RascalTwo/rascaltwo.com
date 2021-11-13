export interface Technology {
	name: string
	image: string
	query?: string
	background?: 'light' | 'dark'
}

export type Technologies = Record<string, Record<string, Technology>>



export type WorkSource = Partial<Record<'repo' | 'gist', string>>

export interface WorkData {
	slug: string
	source?: WorkSource
	urls?: Partial<Record<string | 'image' | 'video' | 'live' | 'source', string>>
	text: {
		title: string
		alt: string
		description?: string
	}
	tags: {
		technologies: Record<string, Technology>
		concepts?: Record<string, Technology>
	}
}