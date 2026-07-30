/**
 * - **Info**: The indexer understood everything and made a harmless decision. Nothing is wrong with the resulting library. (e.g. ignored a frame, trimmed some text)
 * - **Warning**: The library is usable, but some information is missing, ambiguous, or potentially incorrect. The user may want to fix the tags, but indexing continues. (e.g. missing, invalid, or conflicting field(s))
 * - **Error**: The library cannot faithfully represent the data, or an entity could not be created. (i.e. indexing was incomplete)
 */
export type Severity = 'info' | 'warning' | 'error';

export type DiagnosticCode =
	// | 'MULTIPLE_VALUES'
	// | 'INVALID_NUMBER'
	// | 'INVALID_DATE'
	// | 'UNKNOWN_GENRE'
	// | 'MISSING_REQUIRED_FIELD'
	// | 'CONFLICTING_TAGS'
	| 'UNSUPPORTED_FORMAT'
	| 'INVALID_DATA';

export type DiagnosticLocation =
	| { type: 'file'; path: string }
	| { type: 'metadata'; path: string; property: string }
	| { type: 'track'; id: string }
	| { type: 'album'; id: string }
	| { type: 'artist'; id: string };

export interface Diagnostic {
	code: DiagnosticCode;
	severity: Severity;
	message?: string;
	location?: DiagnosticLocation;
}
