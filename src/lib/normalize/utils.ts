export function has<T>(parent: Array<T> | Set<T>, value: unknown): value is T {
	for (const v of parent) {
		if (v === value) return true;
	}

	return false;
}
