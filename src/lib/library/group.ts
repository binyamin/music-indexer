/**
 * Group (raw) tracks by (suspected) album.
 *
 * No entity construction, just grouping/keying logic.
 * @module
 */

import type { Ref } from '#lib/models/entities.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import path from 'node:path';
import type { RawTrack } from './track.ts';

export function getAlbumFolder(file: string): string {
	const folder = path.dirname(file);
	const leaf = path.basename(folder);
	const isDiscFolder = /^(cd|disc)\s*[\.-_]?\s*\d+$/i.test(leaf);

	return isDiscFolder ? path.basename(path.dirname(folder)) : leaf;
}

export interface GroupedTrack extends Omit<Metadata, 'diagnostics'> {
	track: RawTrack;
}

export type Group = {
	dir: string;
	title: string | null;
	artists: Ref<'artist'>[] | null;
	tracks: GroupedTrack[];
};
