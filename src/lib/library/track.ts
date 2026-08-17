/**
 * Construct tracks
 *
 * @module
 */

import path from 'node:path';
import type { Ref } from '../models/entities';
import type { Metadata } from '../models/metadata';
import { resolveArtist } from './artist';
import type { Field } from './utils';

export interface RawTrack {
	path: string;
	title: Field<string>;
	artists: Field<Ref<'artist'>[]>;
}

/**
 * Turns metadata into {@linkcode RawTrack}s.
 */
export async function createRawTrack(
	{ data, path: file }: Metadata,
): Promise<RawTrack> {
	return {
		path: file,
		title: {
			default: data.title,
			computed: path.basename(file, path.extname(file)),
		},
		artists: {
			default: data.artists
				? await Promise.all(data.artists.map(resolveArtist))
				: undefined,
		},
	};
}
