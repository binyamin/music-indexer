/**
 * Construct artist entities
 *
 * @module
 */

import { artistId } from '#lib/ids/index.ts';
import { normalizeArtistName } from '#lib/ids/normalize.ts';
import type { Artist } from '#lib/models/entities.ts';
import type { Result } from './utils.ts';

// The `artistId` method is expensive due to hashing, so we cache the normalized
// artist key instead of the id
const artistCache = new Map<string, Artist>();

/**
 * Resolves an {@linkcode Artist} entity from a raw name string
 */
export function createArtist(name: string): Result<Artist> {
	// same normalization ids uses internally
	const key = normalizeArtistName(name);

	const entity = artistCache.getOrInsertComputed(key, () => {
		const id = artistId({ name });

		return {
			id,
			// Currently, only the first raw value we read is used. Any variations are
			// ignored (e.g. "Mordechai Ben David" vs "MBD")
			name,
		};
	});

	return {
		result: entity,
		diagnostics: [],
	};
}
