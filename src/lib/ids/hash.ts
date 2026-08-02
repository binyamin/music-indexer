/**
 * Create deterministic IDs from strings
 */
export async function hash(value: string): Promise<string> {
	const bytes = new TextEncoder().encode(value);

	// SHA-256 Hash
	const hash = await crypto.subtle.digest('SHA-256', bytes);

	// Encode in `base64url`
	const encoded = new Uint8Array(hash).toBase64({ alphabet: 'base64url' });

	// Safely truncate to first 16 characters
	return encoded.slice(0, 16);
}
