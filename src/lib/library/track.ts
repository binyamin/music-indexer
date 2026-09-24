/**
 * Construct tracks
 *
 * @module
 */

import type { Ref } from '#lib/models/entities.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import path from 'node:path';
import type { Field } from './utils.ts';

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
