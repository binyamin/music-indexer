import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('buildLibrary()', () => {
	describe('albums', () => {
		it.todo('creates an album with title, artists and tracks');

		describe.todo('grouping', () => {
			// candidate albums
			it.todo('splits by file dir');
			it.todo('when file dir is a disc folder, splits by parent dir');

			// raw albums
			it.todo('when defined album titles conflict, splits');
			it.todo('when defined release-types conflict, splits');
			it.todo('when secondary release-types conflict, does not split');
			it.todo('when release-type is missing, does not split');
			it.todo('when defined dates conflict, splits');
			it.todo('when date is missing, does not splits');
			it.todo('when defined album artists conflict, splits');
			it.todo(
				'when some album artists are missing, emits diagnostic & does not split',
			);
		});

		describe.todo('fallbacks', () => {
			describe.todo('missing album title', () => {
				it.todo('falls back to the parent folder name for a multi-track album');

				describe.todo('for a single-track album', () => {
					it.todo('falls back to the track title');
					it.todo('missing track title, falls back to parent folder name');
				});
			});

			describe.todo('missing release-type', () => {
				it.todo('when track count is 1, defaults to single');
				it.todo('when track count is 2+, defaults to album');
			});

			describe.todo('missing album artists', () => {
				it.todo("defaults to intersection of each track's artists");
				it.todo('when intersection is empty, marks as compilation');
			});
		});
	});
});
