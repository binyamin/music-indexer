import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeReleaseType } from './release-type.ts';

describe('normalize', () => {
	describe('release type', () => {
		it('is undefined for an empty array', () => {
			const actual = normalizeReleaseType([]);

			assert.strictEqual(actual.value, undefined);
			assert.strictEqual(actual.diagnostics.length, 0);
		});

		it('normalizes a single primary type', () => {
			const actual = normalizeReleaseType(['album']);

			assert.deepEqual(actual.value, ['album']);
		});

		it('combines a primary type with secondary types', () => {
			const actual = normalizeReleaseType([
				'album',
				'live',
				'compilation',
			]);

			assert.deepEqual(actual.value, [
				'album',
				'live',
				'compilation',
			]);
		});

		it('is undefined when only secondary types are present', () => {
			const actual = normalizeReleaseType(['live']);

			assert.strictEqual(actual.value, undefined);
			assert.strictEqual(actual.diagnostics.length, 1);
			assert.partialDeepStrictEqual(actual.diagnostics[0], {
				level: 'warning',
				code: 'missing',
			});
		});

		it('ignores unknown values', () => {
			const actual = normalizeReleaseType(['album', 'banana']);

			assert.deepEqual(actual.value, ['album']);
			assert.strictEqual(actual.diagnostics.length, 1);
			assert.partialDeepStrictEqual(actual.diagnostics[0], {
				level: 'warning',
				code: 'invalid',
			});
		});

		it('reports a diagnostic and drops the value on conflicting primary types', () => {
			const actual = normalizeReleaseType(['album', 'single']);

			assert.strictEqual(actual.value, undefined);
			assert.strictEqual(actual.diagnostics.length, 1);
			assert.partialDeepStrictEqual(actual.diagnostics[0], {
				level: 'warning',
				code: 'conflicting',
			});
		});
	});
});
