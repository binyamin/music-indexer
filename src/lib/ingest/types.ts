import type { Diagnostic } from '#shared/diagnostic.ts';

export interface RawMetadata {
	title?: string;
	album?: string;
	artists?: string[];
	albumArtists?: string[];
	// arranger?: string[];
	composer?: string[];
	// conductor?: string[];
	track?: {
		no: number;
		of?: number;
	};
	disc?: {
		no: number;
		of?: number;
	};
	genre?: string[];
	lyricist?: string[];
	isrc?: string;
	// mixer?: string[];
	label?: string;
	// producer?: string[];
	releaseDate?: string;
	releaseType?: string[];
	/** Duration in seconds */
	duration: number;
}

export interface FileResult {
	path: string;
	metadata?: RawMetadata;
	diagnostics: Diagnostic[];
}
