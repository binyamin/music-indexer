/**
 * Construct albums
 *
 * @module
 */

import { albumId } from '#lib/ids/index.ts';
import type { Album, Ref } from '#lib/models/entities.ts';
import type { Group, GroupedTrack } from './group.ts';
import { type Field, resolveField } from './utils.ts';

export interface RawAlbum {
	title: Field<string>;
	artists: Field<Ref<'artist'>[]>;
	tracks: GroupedTrack[];
}

/**
 * Constructs a {@linkcode RawAlbum} from a {@link Group}
 */
export function createRawAlbum(group: Group): RawAlbum {
	return {
		title: {
			default: group.title ?? undefined,
			computed:
				(group.tracks.length === 1 ? group.tracks[0].data.title : undefined)
					?? group.dir,
		},
		artists: {
			default: group.artists ?? undefined,
			// The next few lines compute the intersection of all track artists in this Group.
			computed: group.tracks.reduce(
				(prev, curr, idx) => {
					const a = new Set(curr.track.artists.default?.map(v => v.id));

					if (idx === 0) return a;
					return prev.intersection(a);
				},
				new Set<string>(),
			).values().toArray().map(v => ({ entity: 'artist', id: v })),
		},
		tracks: group.tracks,
	};
}

export function createAlbum(raw: RawAlbum): Album {
	// Note that this will always be defined, since the albumFolder is always defined
	const title = resolveField(raw.title)!;
	const artists = resolveField(raw.artists) ?? [];

	return {
		id: albumId({ title, artists }),
		title,
		artists,
		tracks: [],
	};
}
