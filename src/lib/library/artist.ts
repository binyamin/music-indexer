/**
 * Construct artist entities
 *
 * @module
 */

import { artistId } from '../ids';
import { normalizeArtistName } from '../ids/normalize';
import type { Artist } from '../models/entities';
import type { Result } from './utils';

// The `artistId` method is expensive due to hashing, so we cache the normalized
// artist key instead of the id
const artistCache = new Map<string, Artist>();

/**
 * Resolves an {@linkcode Artist} entity from a raw name string
 */
export async function createArtist(name: string): Promise<Result<Artist>> {
	// same normalization ids uses internally
	const key = normalizeArtistName(name);

	const existing = artistCache.get(key);
	if (existing) {
		return {
			result: existing,
			diagnostics: [],
		};
	} else {
		const id = await artistId({ name });

		const entity: Artist = {
			id,
			// Currently, only the first raw value we read is used. Any variations are
			// ignored (e.g. "Mordechai Ben David" vs "MBD")
			name,
		};

		artistCache.set(key, entity);
		return {
			result: entity,
			diagnostics: [],
		};
	}
}
