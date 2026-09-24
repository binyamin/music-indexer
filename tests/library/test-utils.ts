import type { Metadata } from '#lib/models/metadata.ts';

export function makeMetadata(
	overrides: Partial<Omit<Metadata, 'data'>> & {
		data?: Partial<Metadata['data']>;
	} = {},
) {
	return {
		path: '~/Music/Ari Goldwag/D2R7/ayeka.mp3',
		diagnostics: [],
		...overrides,
		data: {
			title: 'Ayeka',
			albumArtists: ['Ari Goldwag'],
			album: 'Darkness to Redemption 7',
			artists: ['Ari Goldwag', 'Danny Palgon'],
			releaseDate: '2026',
			duration: 183,
			...overrides.data,
			track: {
				no: 1,
				...overrides.data?.track,
			},
			disc: {
				no: 1,
				...overrides.data?.disc,
			},
		},
	};
}
