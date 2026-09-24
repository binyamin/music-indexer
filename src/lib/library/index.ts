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

import type { Ref } from '#lib/models/entities.ts';
import type { Library } from '#lib/models/library.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import { createArtist } from './artist.ts';
import { createRawTrack, type RawTrack } from './track.ts';
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
	& ({
		kind: 'file';
		path: string;
	} | {
		kind: 'album' | 'artist';
		id: string;
	} | {
		kind: 'track';
		id: string;
		albumId: string;
	});

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

	const diagnostics: Diagnostic[] = [];

	options?.signal?.throwIfAborted();

	const draftTracks: RawTrack[] = [];

	for await (const item of items) {
		diagnostics.push(...item.diagnostics);
		options?.onEvent?.({
			kind: 'file',
			path: item.path,
			diagnostics: item.diagnostics,
		});

		options?.signal?.throwIfAborted();

		const track_artists: Ref<'artist'>[] = [];

		for (const name of item.data.artists ?? []) {
			const artistResult = createArtist(name);

			if (!lib.artists.has(artistResult.result.id)) {
				lib.artists.set(artistResult.result.id, artistResult.result);
				diagnostics.push(...artistResult.diagnostics);

				options?.onEvent?.({
					kind: 'artist',
					id: artistResult.result.id,
					diagnostics: artistResult.diagnostics,
				});
			}

			track_artists.push({
				entity: 'artist',
				id: artistResult.result.id,
			});

			options?.signal?.throwIfAborted();
		}

		const draftTrack = createRawTrack(item, track_artists);

		draftTracks.push(draftTrack);

		options?.signal?.throwIfAborted();
	}

	return {
		result: lib,
		diagnostics,
	};
}
