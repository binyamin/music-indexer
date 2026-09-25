import { buildLibrary } from '#lib/library/index.ts';
import { expect } from '@std/expect';
import { describe, it } from 'node:test';
import { makeMetadata } from './test-utils';

describe('buildLibrary()', () => {
	const data = makeMetadata({
		data: { artists: ['Moshe Dov Goldwag'], albumArtists: ['Ari Goldwag'] },
	});

	describe('artists', () => {
		it('creates an artist per track artist', async () => {
			const { result } = await buildLibrary([data]);

			const actual = result.artists.values().toArray().map(v => v.name);
			expect(actual).toContainEqual(data.data.artists[0]);
		});

		it('creates an artist per album artist', async () => {
			const { result } = await buildLibrary([data]);

			const actual = result.artists.values().toArray().map(v => v.name);

			expect(actual).toContainEqual(data.data.albumArtists[0]);
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
			expect(result.artists.size).toBe(2);
		});
	});
});
