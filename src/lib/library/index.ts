/**
 * This layer constructs the entities using the normalized metadata from
 * [the normalize layer](../normalize/index.ts).
 *
 * Steps:
 * 1. Create raw tracks
 *   a. Create and stream Artists
 * 2. Group raw tracks by album candidates
 * 3. Finalize each Album from the group of raw tracks
 *   a. Stream Albums
 * 4. Finalize Tracks - some track fields need album-context to compute values
 *   a. Stream Tracks
 * @module
 */

import type { Album, Artist, Track } from '#lib/models/entities.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import type { Metadata } from '../models/metadata.ts';

export type BuildEvent =
	| {
		kind: 'file';
		path: string;
		diagnostics: Diagnostic[];
	}
	| {
		kind: 'artist';
		data: Artist;
		diagnostics: Diagnostic[];
	}
	| {
		kind: 'album';
		data: Album;
		diagnostics: Diagnostic[];
	}
	| {
		kind: 'track';
		data: Track;
		diagnostics: Diagnostic[];
	};

export async function* buildLibrary(
	items: AsyncIterable<Metadata>,
): AsyncGenerator<BuildEvent> {}
