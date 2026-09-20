import { hash as _hash } from 'node:crypto';

/**
 * Create deterministic IDs from strings
 */
export function hash(value: string): string {
	const bytes = new TextEncoder().encode(value);

	// SHA-256 Hash > Encode in `base64url`
	const encoded = _hash('SHA256', bytes, 'base64url');

	// Safely truncate to first 16 characters
	return encoded.slice(0, 16);
}
