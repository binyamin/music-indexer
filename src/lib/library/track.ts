/**
 * Construct tracks
 *
 * @module
 */

import path from 'node:path';
import type { Ref } from '../models/entities';
import type { Metadata } from '../models/metadata';
import type { Field } from './utils';

export interface RawTrack {
	path: string;
	title: Field<string>;
	artists: Field<Ref<'artist'>[]>;
}

/**
 * Turns metadata into {@linkcode RawTrack}s.
 */
export function createRawTrack(
	{ data, path: file }: Metadata,
	artists?: Ref<'artist'>[],
): RawTrack {
	return {
		path: file,
		title: {
			default: data.title,
			computed: path.basename(file, path.extname(file)),
		},
		artists: {
			default: artists?.length ? artists : undefined,
		},
	};
}
