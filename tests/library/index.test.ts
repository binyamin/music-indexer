import { buildLibrary } from '#lib/library/index.ts';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('buildLibrary()', () => {
	describe('empty input', () => {
		it('returns an empty library and no diagnostics', async () => {
			const { result, diagnostics } = await buildLibrary([]);

			assert.equal(diagnostics.length, 0);
			assert.equal(result.albums.size, 0);
			assert.equal(result.artists.size, 0);
			assert.equal(result.tracks.size, 0);
		});
	});

	describe.todo('has input', () => {
		it.todo('forwards any diagnostics');
		it.todo('emits BuildEvents w/ diagnostics');
		it.todo('aborts on ctrl+c');
	});
});
