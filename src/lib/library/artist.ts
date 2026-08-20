/**
 * Construct artist entities
 *
 * @module
 */

import { artistId } from '../ids';
import { normalizeArtistName } from '../ids/normalize';
import type { Ref } from '../models/entities';
import type { BuildEvent } from '.';

// The `artistId` method is expensive due to hashing, so we cache the normalized
// artist key instead of the id
const artistCache = new Map<string, Ref<'artist'>>();

/**
 * Resolves artist {@linkcode Ref}s from an array of raw strings, streaming any
 * new {@linkcode Artist} entities.
 */
export async function* createArtists(
	names: string[],
): AsyncGenerator<BuildEvent & { kind: 'artist' }, Ref<'artist'>[]> {
	const artists: Ref<'artist'>[] = [];

	for (const name of names) {
		// same normalization ids uses internally
		const key = normalizeArtistName(name);

		const existing = artistCache.get(key);
		if (existing) {
			artists.push(existing);
		} else {
			const id = await artistId({ name });

			yield {
				kind: 'artist',
				data: {
					id,
					name, // Currently, the first raw value we read is used for display
				},
				diagnostics: [],
			};

			const ref = artistCache.getOrInsert(key, {
				entity: 'artist',
				id,
			});

			artists.push(ref);
		}
	}

	return artists;
}
