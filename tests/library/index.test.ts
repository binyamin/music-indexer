import { type BuildEvent, buildLibrary } from '#lib/library/index.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import { assertArrayIncludes, assertEquals, assertRejects } from '@std/assert';
import { describe, it } from 'node:test';

describe('buildLibrary()', () => {
	describe('empty input', () => {
		it('returns an empty library and no diagnostics', async () => {
			const { result, diagnostics } = await buildLibrary([]);

			assertEquals(diagnostics.length, 0);
			assertEquals(result.albums.size, 0);
			assertEquals(result.artists.size, 0);
			assertEquals(result.tracks.size, 0);
		});
	});

	describe('has input', () => {
		const diag = {
			code: 'unsupported',
			level: 'warning',
			message: 'Unsupported format',
			location: {
				type: 'file',
				path: '/foo/bar.mp3',
			},
		} satisfies Diagnostic;

		const data: Metadata = {
			path: diag.location.path,
			data: {
				title: 'Yesterday',
				album: 'Help!',
				artists: ['The Beatles'],
				releaseDate: '1965',
				duration: 123,
			},
			diagnostics: [diag],
		};

		it('forwards any diagnostics', async () => {
			const { diagnostics } = await buildLibrary([data]);

			assertArrayIncludes(diagnostics, [diag]);
		});

		it('emits BuildEvents w/ diagnostics', async () => {
			const events: BuildEvent[] = [];

			await buildLibrary([data], {
				onEvent(event) {
					events.push(event);
				},
			});

			assertArrayIncludes(events, [
				{
					kind: 'file',
					path: diag.location.path,
					diagnostics: [diag],
				},
			]);
		});

		it('aborts on ctrl+c', async () => {
			const signal = AbortSignal.abort();

			await assertRejects(() => buildLibrary([data], { signal }), DOMException);
		});
	});
});
