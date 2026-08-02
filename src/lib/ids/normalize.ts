/**
 * Normalization methods for uniqueness checking
 *
 * Not for display or sorting
 *
 * @module
 */

/**
 * Remove leading articles (The, A, An)
 */
export const untitle = (s: string) => s.replace(/^(the|a|an)\b/i, '');

export function removeDiacritics(value: string): string {
	return value
		// extract diacritics
		.normalize('NFKD')
		// strip diacritics
		.replace(/\p{M}/gu, '');
}

/**
 * Normalize Artist names
 *
 * For uniqueness *only* (not for display or sorting)
 */
export function normalizeArtistName(name: string) {
	// [1] Case folding
	// [2] Trim/collapse whitespace
	// [3] Remove punctuation
	// [4] Remove diacritics
	// [5] Remove leading articles (The, A, An)
	// [6] Convert & → and
	// [7] Remove apostrophes
	return removeDiacritics(
		untitle(name), // [5]
	) // [4]
		.toLowerCase() // [1]
		.replace(/&/g, 'and') // [6]
		.replace(/\p{P}/gu, ' ') // [3], [7]
		.replace(/\s+/g, ' ') // [2]
		.replace(/ /g, ''); // [2]
}

/**
 * Normalize Album/Track title
 *
 * For uniqueness *only* (not for display or sorting)
 */
export function normalizeTitle(name: string) {
	// [1] Case folding
	// [2] Trim/collapse whitespace
	// [3] Remove punctuation
	// [4] Remove diacritics
	// [5] Convert & → and
	// [6] Remove apostrophes
	return removeDiacritics(name) // [4]
		.toLowerCase() // [1]
		.replace(/&/g, 'and') // [5]
		.replace(/\p{P}/gu, ' ') // [3], [6]
		.replace(/\s+/g, ' ') // [2]
		.replace(/ /g, ''); // [2]
}
