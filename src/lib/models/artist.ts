export interface Artist {
	id: string;
	name: string;
}

export interface ArtistRef {
	kind: 'artist';
	id: string;
}
