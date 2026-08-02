import assert from 'node:assert/strict';
import { describe, it, test } from 'node:test';
import {
	normalizeArtistName,
	normalizeTitle,
	removeDiacritics,
	untitle,
} from './normalize.ts';

test('untitle', () => {
	const actual = untitle('The Beatles');
	assert.strictEqual(actual, ' Beatles');
});

test('remove diacritics', () => {
	const before = 'Crème brûlée';
	const expected = 'Creme brulee';

	const actual = removeDiacritics(before);
	assert.strictEqual(actual, expected);
});

describe('normalize artist name', () => {
	it('removes punctuation', () => {
		const input = 'AC/DC';
		const expected = 'acdc';
		const actual = normalizeArtistName(input);
		assert.strictEqual(actual, expected);
	});

	it('Collapses whitespace', () => {
		const input = 'Ari Goldwag';
		const expected = 'arigoldwag';
		const actual = normalizeArtistName(input);
		assert.strictEqual(actual, expected);
	});

	it('Converts "&" to "and"', () => {
		const input = 'Simon & Garfunkle';
		const expected = 'simonandgarfunkle';
		const actual = normalizeArtistName(input);
		assert.strictEqual(actual, expected);
	});
});

describe('normalize album title', () => {
	it('removes punctuation', () => {
		const input = 'Project Relax, Vol. 2';
		const expected = 'projectrelaxvol2';
		const actual = normalizeTitle(input);
		assert.strictEqual(actual, expected);
	});

	it('Collapses whitespace', () => {
		const input = 'One Heart';
		const expected = 'oneheart';
		const actual = normalizeTitle(input);
		assert.strictEqual(actual, expected);
	});

	it('Converts "&" to "and"', () => {
		const input = 'Ah Mechayeh! & Other Yiddish Songs';
		const expected = 'ahmechayehandotheryiddishsongs';
		const actual = normalizeTitle(input);
		assert.strictEqual(actual, expected);
	});

	it('Preserves leading articles', () => {
		const input = 'A Cappella Soul 5';
		const expected = 'acappellasoul5';
		const actual = normalizeTitle(input);
		assert.strictEqual(actual, expected);
	});
});
