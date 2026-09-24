import { artistId } from '#lib/ids/index.ts';
import { buildLibrary } from '#lib/library/index.ts';
import { expect } from '@std/expect';
import { describe, it } from 'node:test';
import { makeMetadata } from './test-utils';

describe('buildLibrary()', () => {
	describe('tracks', () => {
		it('creates a track with album ref, numbers, title and artists', async () => {
			const data = makeMetadata();

			const { result } = await buildLibrary([data]);

			const track = result.tracks.values().toArray()[0];

			expect(track).toMatchObject(
				{
					title: data.data.title,
					disc_number: 1,
					track_number: 1,
					artists: [{
						entity: 'artist',
						id: artistId({
							name: data.data.artists[0],
						}),
					}],
				},
			);
		});

		// TODO: expect correct diagnostics
		it('missing title, defaults to file stem', async () => {
			const data = makeMetadata({ data: { title: undefined } });

			const expected = data.path.replace(/.+\/(.+)\.mp3$/, '$1');

			const { result } = await buildLibrary([data]);
			const actual = result.tracks.values().toArray()[0]?.title;

			expect(actual).toBe(expected);
		});

		// TODO: expect correct diagnostics
		it('missing artists, defaults to album artists', async () => {
			const data = makeMetadata({ data: { artists: undefined } });
			const { result } = await buildLibrary([data]);

			const actual = result.tracks.values().toArray()[0]?.artists;

			const expected = {
				entity: 'artist',
				id: artistId({
					name: data.data.albumArtists[0],
				}),
			};

			expect(actual).toContainEqual(expected);
		});

		// TODO: expect correct diagnostics
		describe('missing track number', () => {
			it.todo('when release-type is single, defaults to 1', async () => {
				const data = makeMetadata({
					data: {
						releaseType: ['single'],
						track: undefined,
					},
				});

				const { result } = await buildLibrary([data]);

				const actual = result.tracks.values().toArray()[0]?.track_number;
				expect(actual).toBe(1);
			});

			it.todo('when release-type is album, emits diagnostic', async () => {
				const data = makeMetadata({
					data: {
						releaseType: ['album'],
						track: undefined,
					},
				});

				const { diagnostics, result } = await buildLibrary([data]);

				const track = result.tracks.values().toArray()[0];
				expect(track?.track_number).toBeUndefined();
				expect(diagnostics).toMatchObject([
					{
						code: 'missing',
						level: 'warning',
						location: {
							type: 'track',
						},
					},
				]);
			});
		});

		// TODO: expect correct diagnostics
		it('missing disc number, defaults to 1', async () => {
			const data = makeMetadata({
				data: {
					disc: undefined,
				},
			});

			const { result } = await buildLibrary([data]);

			const actual = result.tracks.values().toArray()[0]?.disc_number;
			expect(actual).toBe(1);
		});
	});
});
