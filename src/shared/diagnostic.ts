/**
 * Diagnostics for graceful, non-throwing indexing failures.
 *
 * The indexer never panics on bad or missing data — it degrades gracefully
 * and reports a {@linkcode Diagnostic} instead, so a CLI (or other consumer)
 * can decide how to surface it.
 *
 * @module
 */

/**
 * How loud the CLI should be about a diagnostic
 *
 * - **Info**: The indexer understood everything and made a harmless decision. Nothing is wrong with the resulting library. (e.g. ignored a frame, trimmed some text)
 * - **Warning**: The library is usable, but some information is missing, ambiguous, or potentially incorrect. The user may want to fix the tags, but indexing continues. (e.g. missing, invalid, or conflicting field(s))
 * - **Error**: The library cannot faithfully represent the data, or an entity could not be created. (i.e. indexing was incomplete)
 */
export type Severity = 'info' | 'warning' | 'error';

/**
 * The *reason* indexing deviated from the happy path.
 *
 * Deliberately a small closed set of "why", not "what"
 */
export type DiagnosticCode =
	// expected data wasn't present
	| 'missing'
	// data was present but malformed, unparseable, or out of range
	| 'invalid'
	// multiple sources disagree (includes exact duplicates)
	| 'conflicting'
	// indexer has no handling for this format/feature/field
	| 'unsupported';

export type DiagnosticLocation =
	| { type: 'file'; path: string }
	| { type: 'metadata'; path: string; property: string }
	| { type: 'track'; id: string }
	| { type: 'album'; id: string }
	| { type: 'artist'; id: string };

export interface Diagnostic {
	/** How loud the CLI should be about a diagnostic */
	level: Severity;
	/** The *reason* indexing deviated from the happy path */
	code: DiagnosticCode;
	/** Human-readable detail. This is the only view into *what* happened. */
	message: string;
	/** Where did this occur */
	location: DiagnosticLocation;
}
