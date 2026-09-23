import { type BuildEvent, buildLibrary } from '#lib/library/index.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import { expect } from '@std/expect';
import { describe, it } from 'node:test';

describe('buildLibrary()', () => {
	describe('empty input', () => {
		it('returns an empty library and no diagnostics', async () => {
			const { result, diagnostics } = await buildLibrary([]);

			expect(diagnostics.length).toBe(0);
			expect(result.albums.size).toBe(0);
			expect(result.artists.size).toBe(0);
			expect(result.tracks.size).toBe(0);
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

			expect(diagnostics).toEqual([diag]);
		});

		it('emits BuildEvents w/ diagnostics', async () => {
			const events: BuildEvent[] = [];

			await buildLibrary([data], {
				onEvent(event) {
					events.push(event);
				},
			});

			expect(events).toEqual([
				{
					kind: 'file',
					path: diag.location.path,
					diagnostics: [diag],
				},
			]);
		});

		it('aborts on ctrl+c', async () => {
			const signal = AbortSignal.abort();

			await expect(buildLibrary([data], { signal }))
				.rejects.toThrow(DOMException);
		});
	});
});
