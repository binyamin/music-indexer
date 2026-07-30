import type { ArtistRef } from './artist';
import type { TrackRef } from './track';

export interface Album {
	id: string;
	title: string;
	artists: ArtistRef[];
	tracks: TrackRef[];
}

export interface AlbumRef {
	kind: 'album';
	id: string;
}
