import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeMetadata } from './metadata.ts';
import { makeFile } from './test-utils.ts';

describe('normalize', () => {
	describe('title', () => {
		it('defaults to the file name without extension', () => {
			const file = makeFile({
				path: '/music/Greatest Hits/01 - Yesterday.mp3',
			});

			const actual = normalizeMetadata(file);

			assert.strictEqual(actual.data.title, '01 - Yesterday');
		});

		it('handles extensions with multiple dots', () => {
			const file = makeFile({
				path: '/music/Greatest Hits/song.backup.mp3',
			});

			const actual = normalizeMetadata(file);

			assert.strictEqual(actual.data.title, 'song.backup');
		});

		it('is overridden by metadata.title', () => {
			const file = makeFile({ metadata: { title: 'Yesterday' } });

			const actual = normalizeMetadata(file);

			assert.strictEqual(actual.data.title, 'Yesterday');
		});
	});

	describe.todo('album', () => {
		it('defaults to the name of the parent directory', () => {
			const file = makeFile();

			const actual = normalizeMetadata(file);

			assert.strictEqual(actual.data.album, 'Greatest Hits');
		});

		it('is overridden by metadata.album', () => {
			const file = makeFile({ metadata: { album: 'Help!' } });

			const actual = normalizeMetadata(file);

			assert.strictEqual(actual.data.album, 'Help!');
		});
	});
});
