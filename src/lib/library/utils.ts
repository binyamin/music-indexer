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
