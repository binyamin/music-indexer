/**
 * Construct artist entities
 *
 * @module
 */

import { artistId } from '../ids';
import { normalizeArtistName } from '../ids/normalize';
import type { Artist, Ref } from '../models/entities';

/**
 * Syntax sugar for creating an artist entity (not ref).
 */
async function createArtist(name: string): Promise<Artist> {
	return {
		id: await artistId({ name }),
		name, // Currently, the first raw value we read is used for display
	};
}

// key = normalized name, not id
const artistsByKey = new Map<string, Artist>();

/**
 * Resolve an artist {@linkcode Ref} from the raw name (string).
 */
// Note: This method exists to avoid computing the id for each name separately.
// The hashing procedure is expensive, so we cache the normalized artist key.
export async function resolveArtist(rawName: string): Promise<Ref<'artist'>> {
	// same normalization ids uses internally
	const key = normalizeArtistName(rawName);

	const existing = artistsByKey.get(key);
	if (existing) return { entity: 'artist', id: existing.id };

	const artist = await createArtist(rawName);

	artistsByKey.set(key, artist);

	return { entity: 'artist', id: artist.id };
}
