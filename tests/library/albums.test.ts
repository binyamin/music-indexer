import { albumId, artistId, trackId } from '#lib/ids/index.ts';
import { buildLibrary } from '#lib/library/index.ts';
import type { Album, Track } from '#lib/models/entities.ts';
import { expect } from '@std/expect';
import { describe, it } from 'node:test';
import { makeMetadata } from './test-utils';

describe('buildLibrary()', () => {
	describe('albums', () => {
		it('creates an album with title, artists and tracks', async () => {
			const data = makeMetadata();

			const albumArtists = data.data.albumArtists.map(v => ({
				entity: 'artist' as const,
				id: artistId({ name: v }),
			}));

			const album_id = albumId({
				title: data.data.album,
				artists: albumArtists,
			});

			const expected_track = {
				id: trackId({
					album: { entity: 'album', id: album_id },
					disc_number: 1,
					track_number: 1,
				}),
				album: { entity: 'album', id: album_id },
				title: data.data.title,
				disc_number: 1,
				track_number: 1,
				artists: data.data.artists.map(v => ({
					entity: 'artist',
					id: artistId({ name: v }),
				})),
			} satisfies Track;

			const expected_album = {
				id: album_id,
				title: data.data.album,
				artists: albumArtists,
				tracks: [{
					entity: 'track',
					id: expected_track.id,
				}],
			} satisfies Album;

			const { result } = await buildLibrary([data]);

			const actual_album = result.albums.values().toArray()[0];
			const actual_track = result.tracks.values().toArray()[0];

			expect(actual_album).toMatchObject(expected_album);
			expect(actual_track).toMatchObject(expected_track);
		});

		// TODO: expect correct diagnostics
		describe('grouping', () => {
			// candidate albums
			it('splits by file dir', async () => {
				const { result } = await buildLibrary([
					makeMetadata({ path: '~/Music/D2R7/ayeka.mp3' }),
					makeMetadata({
						path: '~/Music/D2R6/elul.mp3',
						data: { album: 'Darkness to Redemption 6' },
					}),
				]);

				expect(result.albums.size).toBe(2);
			});

			it('when file dir is a disc folder, splits by parent dir', async () => {
				const { result } = await buildLibrary([
					makeMetadata({ path: '~/Music/D2R7/Disc 1/ayeka.mp3' }),
					makeMetadata({ path: '~/Music/D2R7/Disc 2/elul.mp3' }),
				]);

				expect(result.albums.size).toBe(1);
			});

			// raw albums
			it('when defined album titles conflict, emits diagnostic & splits', async () => {
				const { result } = await buildLibrary([
					makeMetadata(),
					makeMetadata({
						data: {
							title: 'One More Dance',
							album: 'Darkness to Redemption 6',
						},
					}),
				]);

				expect(result.albums.size).toBe(2);
			});

			it('when some album titles are missing, emits diagnostic & splits', async () => {
				const { result } = await buildLibrary([
					makeMetadata(),
					makeMetadata({
						data: {
							title: 'One More Dance',
							album: undefined,
						},
					}),
				]);

				expect(result.albums.size).toBe(2);
			});

			it.todo('when defined release-types conflict, emits diagnostic & splits', async () => {
				const { result } = await buildLibrary([
					makeMetadata({ data: { releaseType: ['album'] } }),
					makeMetadata({
						data: {
							title: 'One More Dance',
							releaseType: ['single'],
						},
					}),
				]);
				expect(result.albums.size).toBe(2);
			});

			it.todo('when secondary release-types conflict, emits diagnostic & merges', async () => {
				const { result } = await buildLibrary([
					makeMetadata({ data: { releaseType: ['album', 'live'] } }),
					makeMetadata({
						data: {
							title: 'One More Dance',
							releaseType: ['album'],
						},
					}),
				]);
				expect(result.albums.size).toBe(1);

				// TODO(future): expect "release-type" to be "album", not ["album", "live"]
			});

			it.todo('when some release-types are missing, emits diagnostic & merges', async () => {
				const { result } = await buildLibrary([
					makeMetadata({ data: { releaseType: ['album'] } }),
					makeMetadata({
						data: {
							title: 'One More Dance',
							releaseType: undefined,
						},
					}),
				]);
				expect(result.albums.size).toBe(1);

				// TODO(future): expect "release-type" to be "album"
			});

			it.todo('when defined dates conflict, emits diagnostic & splits', async () => {
				const { result } = await buildLibrary([
					makeMetadata({
						data: { releaseDate: '2026' },
					}),
					makeMetadata({
						data: {
							title: 'One More Dance',
							releaseDate: '2025',
						},
					}),
				]);

				expect(result.albums.size).toBe(2);
			});

			it.todo('when some dates are missing, emits diagnostic & merges', async () => {
				const { result } = await buildLibrary([
					makeMetadata({
						data: { releaseDate: '2026' },
					}),
					makeMetadata({
						data: {
							title: 'One More Dance',
							releaseDate: undefined,
						},
					}),
				]);

				expect(result.albums.size).toBe(1);

				// TODO(future): expect "release-date" to be "2026"
			});

			it('when defined album artists conflict, emits diagnostic & splits', async () => {
				const { result } = await buildLibrary([
					makeMetadata({
						data: { albumArtists: ['Ari Goldwag'] },
					}),
					makeMetadata({
						data: {
							title: 'One More Dance',
							albumArtists: ['Ari Goldwag', 'Moshe Dov Goldwag'],
						},
					}),
				]);

				expect(result.albums.size).toBe(2);
			});

			it('when some album artists are missing, emits diagnostic & splits', async () => {
				const { result } = await buildLibrary([
					makeMetadata({
						data: { albumArtists: ['Ari Goldwag'] },
					}),
					makeMetadata({
						data: {
							albumArtists: ['Moshe Dov Goldwag'],
						},
					}),
					makeMetadata({
						data: { albumArtists: undefined },
					}),
				]);

				expect(result.albums.size).toBe(3);
			});
		});

		// TODO: expect correct diagnostics
		describe('fallbacks', () => {
			describe('missing album title', () => {
				it('falls back to the parent folder name for a multi-track album', async () => {
					const expected = 'D2R7';

					const { result } = await buildLibrary([
						makeMetadata({ data: { album: undefined } }),
						makeMetadata({
							data: { album: undefined, title: 'One More Dance' },
						}),
					]);

					const actual = result.albums.values().toArray()[0].title;
					expect(actual).toBe(expected);
				});

				describe('for a single-track album', () => {
					it('falls back to the track title', async () => {
						const data = makeMetadata({ data: { album: undefined } });
						const expected = data.data.title;

						const { result } = await buildLibrary([data]);

						const actual = result.albums.values().toArray()[0].title;
						expect(actual).toBe(expected);
					});

					it('missing track title, falls back to parent folder name', async () => {
						const expected = 'D2R7';

						const { result } = await buildLibrary([
							makeMetadata({ data: { album: undefined, title: undefined } }),
						]);

						const actual = result.albums.values().toArray()[0].title;
						expect(actual).toBe(expected);
					});
				});
			});

			describe.todo('missing release-type', () => {
				// Future
				it.todo('when track count is 1, defaults to single');
				// Future
				it.todo('when track count is 2+, defaults to album');
			});

			describe('missing album artists', () => {
				it("defaults to intersection of each track's artists", async () => {
					const expected = {
						entity: 'artist',
						id: artistId({ name: 'Ari Goldwag' }),
					};

					const { result } = await buildLibrary([
						makeMetadata({ data: { albumArtists: undefined } }),
						makeMetadata({
							data: {
								title: 'One More Dance',
								albumArtists: undefined,
								artists: ['Ari Goldwag'],
							},
						}),
					]);

					const actual = result.albums.values().toArray()[0].artists;
					expect(actual).toContainEqual(expected);
				});

				// Future
				it.todo('when intersection is empty, marks as compilation');
			});
		});
	});
});
