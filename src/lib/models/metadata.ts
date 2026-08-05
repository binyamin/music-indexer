import type { Diagnostic } from '../../shared/diagnostic.ts';

/**
 * @see https://musicbrainz.org/doc/Release_Group/Type
 */
export type ReleaseType = [
	primary: 'album' | 'ep' | 'single',
	...secondary: ('compilation' | 'soundtrack' | 'live' | 'remix' | 'demo')[],
];

export interface Metadata {
	path: string;
	diagnostics: Diagnostic[];
	data: {
		title: string;
		album?: string;
		artists?: string[];
		albumArtists?: string[];
		track?: {
			no: number;
			of?: number;
		};
		disc?: {
			no: number;
			of?: number;
		};
		releaseDate?: string;
		releaseType?: ReleaseType;

		/** Duration in seconds */
		duration: number;
	};
}
