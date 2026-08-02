import type { Diagnostic } from '../../shared/diagnostic';
import { has } from '../../shared/utils.ts';
import type { ReleaseType } from '../models/metadata';

export function normalizeReleaseType(value: string[]): {
	value?: ReleaseType;
	diagnostics: Diagnostic[];
} {
	const diagnostics: Diagnostic[] = [];

	value ??= [];
	if (value.length === 0) {
		return {
			value: undefined,
			diagnostics,
		};
	}

	const pt: ReleaseType[0][] = ['album', 'single', 'ep'];
	const st: ReleaseType[1][] = [
		'compilation',
		'demo',
		'live',
		'remix',
		'soundtrack',
	];

	const primaryType = new Set<ReleaseType[0]>();
	const secondaryTypes = new Set<ReleaseType[1]>();

	for (const v of value) {
		if (has(pt, v)) {
			primaryType.add(v);
		} else if (has(st, v)) {
			secondaryTypes.add(v);
		}
	}

	if (primaryType.size > 1) {
		diagnostics.push({
			code: 'conflicting',
			level: 'warning',
			message: `Found multiple primary types (${
				[...primaryType].join(', ')
			}); ignoring field`,
			location: {
				type: 'metadata',
				property: 'releaseType',
			},
		});

		return {
			diagnostics,
		};
	}

	return {
		value: primaryType.size
			? [[...primaryType.values()][0], ...secondaryTypes]
			: undefined,
		diagnostics,
	};
}
