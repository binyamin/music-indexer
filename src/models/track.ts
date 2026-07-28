import { AlbumRef } from './album';
import { ArtistRef } from './artist';

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
