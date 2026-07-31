import type { Album } from './album';
import type { Artist } from './artist';
import type { Track } from './track';

export interface Library {
	artists: Map<string, Artist>;
	albums: Map<string, Album>;
	tracks: Map<string, Track>;
}
