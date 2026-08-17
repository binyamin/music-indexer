/**
 * Group (raw) tracks by (suspected) album.
 *
 * No entity construction, just grouping/keying logic.
 * @module
 */

import path from 'node:path';
import type { RawTrack } from './track';

function getAlbumFolder(file: string): string {
	const folder = path.dirname(file);
	const leaf = path.basename(folder);
	const isDiscFolder = /^(cd|disc)\s*[\.-_]?\s*\d+$/i.test(leaf);

	return isDiscFolder ? path.dirname(folder) : folder;
}

export async function group(
	tracks: AsyncIterable<RawTrack>,
): Promise<Map<string, RawTrack[]>> {
	const buckets = new Map<string, RawTrack[]>();

	for await (const t of tracks) {
		const key = getAlbumFolder(t.path);
		const b = buckets.getOrInsert(key, []);
		b.push(t);
	}

	return buckets;
}
