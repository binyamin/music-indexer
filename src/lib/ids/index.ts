/**
 * Identity Keys, for uniqueness matching.
 *
 * @module
 */

import type { Album } from '../models/album';
import type { Artist } from '../models/artist';
import type { Track } from '../models/track';
import { hash } from './hash';
import { normalizeArtistName, normalizeTitle } from './normalize';

export async function artistId(data: Pick<Artist, 'name'>) {
	const key = normalizeArtistName(data.name);

	return await hash(key);
}

export async function albumId(data: Pick<Album, 'title' | 'artists'>) {
	const key = [
		normalizeTitle(data.title),
		...data.artists.map(v => v.id).sort(),
	].join('\0');

	return await hash(key);
}

export async function trackId(
	data: Pick<Track, 'album' | 'track_number' | 'disc_number'>,
) {
	const key = [
		data.album.id,
		data.track_number,
		data.disc_number,
	].join('\0');

	return await hash(key);
}
