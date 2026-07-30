import type { AlbumRef } from './album';
import type { ArtistRef } from './artist';

export interface Track {
	id: string;
	album: AlbumRef;
	track_number: number;
	disc_number: number;

	title: string;
	artists: ArtistRef[];
	// duration_seconds: number;
}

export interface TrackRef {
	kind: 'track';
	id: string;
}
