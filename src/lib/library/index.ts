/**
 * This layer constructs the entities using the normalized metadata from
 * [the normalize layer](../normalize/index.ts).
 *
 * Steps:
 * 1. Create raw tracks
 *   a. Create and save Artists
 * 2. Group raw tracks by album candidates
 * 3. Finalize each Album from the group of raw tracks
 *   a. Save Albums
 * 4. Finalize Tracks - some track fields need album-context to compute values
 *   a. Save Tracks
 * @module
 */

import type { Library } from '#lib/models/library.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import type { Metadata } from '../models/metadata.ts';
import type { Result } from './utils.ts';

export type BuildEvent<
	T extends 'file' | 'artist' | 'album' | 'track' =
		| 'file'
		| 'artist'
		| 'album'
		| 'track',
> =
	& {
		kind: T;
		diagnostics: Diagnostic[];
	}
	& (T extends 'file' ? {
			path: string;
		}
		: {
			id: string;
		})
	& (T extends 'track' ? {
			albumId: string;
		}
		: {});

export interface BuildOptions {
	onEvent?: (event: BuildEvent) => void;
	signal?: AbortSignal;
}

export async function buildLibrary(
	items: Iterable<Metadata> | AsyncIterable<Metadata>,
	options?: BuildOptions,
): Promise<Result<Library>> {
	const lib: Library = {
		artists: new Map(),
		albums: new Map(),
		tracks: new Map(),
	};

	return {
		result: lib,
		diagnostics: [],
	};
}
