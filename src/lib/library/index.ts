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

import { candidateAlbumKey } from '#lib/ids/index.ts';
import type { Ref } from '#lib/models/entities.ts';
import type { Library } from '#lib/models/library.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import { createAlbum, createRawAlbum } from './album.ts';
import { createArtist } from './artist.ts';
import { getAlbumFolder, type Group, type GroupedTrack } from './group.ts';
import { createRawTrack, createTrack } from './track.ts';
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

	const draftTracks: GroupedTrack[] = [];

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

		draftTracks.push({
			path: item.path,
			data: item.data,
			track: draftTrack,
		});

		options?.signal?.throwIfAborted();
	}

	// Group tracks into candidate albums
	const groups = new Map<string, Group>();

	for (const t of draftTracks) {
		const album_artists: Ref<'artist'>[] = [];

		for (const name of t.data.albumArtists ?? []) {
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

			album_artists.push({
				entity: 'artist',
				id: artistResult.result.id,
			});

			options?.signal?.throwIfAborted();
		}

		const dir = getAlbumFolder(t.path);

		const key = candidateAlbumKey({
			dir,
			title: t.data.album,
			artists: album_artists,
		});

		const group = groups.getOrInsert(key, {
			dir,
			title: t.data.album ?? null,
			artists: album_artists.length ? album_artists : null,
			tracks: [],
		});

		group.tracks.push(t);

		options?.signal?.throwIfAborted();
	}

	for (const [, g] of groups) {
		const draftAlbum = createRawAlbum(g);
		options?.signal?.throwIfAborted();

		const album = createAlbum(draftAlbum);

		lib.albums.set(album.id, album);

		options?.onEvent?.({
			kind: 'album',
			id: album.id,
			diagnostics: [], // TODO
		});

		options?.signal?.throwIfAborted();

		for (const t of g.tracks) {
			const track = createTrack(t, album);

			album.tracks.push({
				entity: 'track',
				id: track.id,
			});

			lib.tracks.set(track.id, track);

			options?.onEvent?.({
				kind: 'track',
				id: track.id,
				albumId: album.id,
				diagnostics: [], // TODO
			});

			options?.signal?.throwIfAborted();
		}
	}

	return {
		result: lib,
		diagnostics,
	};
}
