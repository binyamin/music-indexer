import { buildLibrary } from '#lib/library/index.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import { assertArrayIncludes, assertEquals } from '@std/assert';
import { describe, it } from 'node:test';

describe('buildLibrary()', () => {
	const data: Metadata = {
		path: '~/Music/Charlie Puth/Voicenotes/change.mp3',
		data: {
			title: 'Change',
			albumArtists: ['Charlie Puth'],
			album: 'Voicenotes',
			artists: ['James Taylor'], // Note: Charlie Puth is actually an artist here as well, but we need to test w/o it.
			releaseDate: '2018-05-11',
			duration: 217,
		},
		diagnostics: [],
	};

	describe('artists', () => {
		it('creates an artist per track artist', async () => {
			const { result } = await buildLibrary([data]);
			assertArrayIncludes(
				[...result.artists.values()].map(v => v.name),
				data.data.artists!,
			);
		});

		it('creates an artist per album artist', async () => {
			const { result } = await buildLibrary([data]);
			assertArrayIncludes(
				[...result.artists.values()].map(v => v.name),
				data.data.albumArtists!,
			);
		});

		it('dedupes artists', async () => {
			const { result } = await buildLibrary(
				[{
					...data,
					data: {
						...data.data,
						artists: [data.data.artists ?? [], data.data.albumArtists ?? []]
							.flat(),
					},
				}],
			);
			assertEquals(result.artists.size, 2);
		});
	});
});
