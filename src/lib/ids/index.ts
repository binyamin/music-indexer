/**
 * Identity Keys, for uniqueness matching.
 *
 * @module
 */

import type { Album, Artist, Track } from '#lib/models/entities.ts';
import { hash } from './hash.ts';
import { normalizeArtistName, normalizeTitle } from './normalize.ts';

export function artistId(data: Pick<Artist, 'name'>): string {
	const key = normalizeArtistName(data.name);

	return hash(key);
}

export function albumId(data: Pick<Album, 'title' | 'artists'>): string {
	const key = [
		normalizeTitle(data.title),
		...data.artists.map((v) => v.id).sort(),
	].join('\0');

	return hash(key);
}

export function candidateAlbumKey(
	data: { dir: string; title?: string; artists: Album['artists'] },
): string {
	// Note: this key is made up of all an album candidate's unique fields
	const key = [
		data.dir,
		normalizeTitle(data.title ?? ''),
		...data.artists.map((v) => v.id).sort(),
	].join('\0');

	return key;
}

export function trackId(
	data: Pick<
		Track,
		'album' | 'track_number' | 'disc_number'
	>,
): string {
	const key = [
		data.album.id,
		data.track_number,
		data.disc_number,
	].join('\0');

	return hash(key);
}
