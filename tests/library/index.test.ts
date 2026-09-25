import { type BuildEvent, buildLibrary } from '#lib/library/index.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import { expect } from '@std/expect';
import { describe, it } from 'node:test';
import { makeMetadata } from './test-utils.ts';

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
		const data = makeMetadata();

		const diag = {
			code: 'unsupported',
			level: 'warning',
			message: 'Unsupported format',
			location: {
				type: 'file',
				path: data.path,
			},
		} satisfies Diagnostic;

		data.diagnostics.push(diag);

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

			expect(events).toContainEqual({
				kind: 'file',
				path: diag.location.path,
				diagnostics: [diag],
			});
		});

		it('aborts on ctrl+c', async () => {
			const signal = AbortSignal.abort();

			await expect(buildLibrary([data], { signal }))
				.rejects.toThrow(DOMException);
		});
	});
});
