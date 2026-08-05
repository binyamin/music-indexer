import type { Album, Artist, Track } from './entities.ts';

export interface Library {
	artists: Map<string, Artist>;
	albums: Map<string, Album>;
	tracks: Map<string, Track>;
}
