import type { Diagnostic } from '#shared/diagnostic.ts';

export interface Field<T> {
	default?: T;
	computed?: T;
}

/**
 * A small shared helper for the `.default ?? .computed` pattern, used anywhere
 * a {@linkcode Field} gets read.
 */
export function resolveField<T>(field: Field<T>): T | undefined {
	return field.default ?? field.computed;
}

export interface Result<T> {
	result: T;
	diagnostics: Diagnostic[];
}

/**
 * Support for ES2026+ `Map.prototype.getOrInsertComputed`
 */
export function getOrInsertComputed<K, V>(
	map: Map<K, V>,
	key: K,
	fn: (key: K) => V,
) {
	return map.get(key) || (() => {
		const e = fn(key);
		map.set(key, e);
		return e;
	})();
}

/**
 * Support for ES2026+ `Map.prototype.getOrInsert`
 */
export function getOrInsert<K, V>(
	map: Map<K, V>,
	key: K,
	value: V,
) {
	return map.get(key) || (() => {
		map.set(key, value);
		return value;
	})();
}
