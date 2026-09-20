import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('buildLibrary()', () => {
	describe('tracks', () => {
		it.todo('creates a track with album ref, numbers, title and artists');
		it.todo('missing title, defaults to file stem');

		it.todo('missing artists, defaults to album artists');

		describe.todo('missing track number', () => {
			it.todo('when release-type is single, defaults to 1');
			it.todo('when release-type is album or ep, emits diagnostic');
		});

		it.todo('missing disc number, defaults to 1');
	});
});
