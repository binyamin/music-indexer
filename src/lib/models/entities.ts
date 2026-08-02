/**
 * Core domain types/schemas (album, artist, track)
 *
 * @module
 */

/**
 * Used when referencing an entity (i.e. relations)
 */
export interface Ref<Entity extends 'artist' | 'album' | 'track'> {
	entity: Entity;
	id: string;
}

export interface Artist {
	id: string;
	name: string;
}

export interface Album {
	id: string;
	title: string;
	artists: Ref<'artist'>[];
	tracks: Ref<'track'>[];
}

export interface Track {
	id: string;
	album: Ref<'album'>;
	track_number: number;
	disc_number: number;

	title: string;
	artists: Ref<'artist'>[];
	// duration_seconds: number;
}
