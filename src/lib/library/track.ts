/**
 * Construct tracks
 *
 * @module
 */

import { trackId } from '#lib/ids/index.ts';
import type { Album, Ref, Track } from '#lib/models/entities.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import path from 'node:path';
import type { GroupedTrack } from './group.ts';
import { type Field, resolveField } from './utils.ts';

export interface RawTrack {
	title: Field<string>;
	artists: Field<Ref<'artist'>[]>;
}

/**
 * Turns metadata into {@linkcode RawTrack}s.
 */
export function createRawTrack(
	{ data, path: file }: Metadata,
	artists: Ref<'artist'>[],
): RawTrack {
	return {
		title: {
			default: data.title,
			computed: path.basename(file, path.extname(file)),
		},
		artists: {
			default: artists.length ? artists : undefined,
		},
	};
}

export function createTrack(
	raw: GroupedTrack,
	album: Album,
): Track {
	const disc = raw.data.disc?.no ?? 1;
	if (!raw.data.track?.no) throw new Error('Not implemented yet');

	// title is always defined, since file name is always defined
	const title = resolveField(raw.track.title)!;

	const id = trackId({
		album: { entity: 'album', id: album.id },
		disc_number: disc,
		track_number: raw.data.track.no,
	});

	return {
		id,
		album: { entity: 'album', id: album.id },
		title,
		artists: resolveField(raw.track.artists) ?? album.artists,
		disc_number: disc,
		track_number: raw.data.track.no,
	};
}
