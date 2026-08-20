import type { Diagnostic } from '#shared/diagnostic.ts';
import { has } from '#shared/utils.ts';
import type { ReleaseType } from '../models/metadata.ts';

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
		} else {
			diagnostics.push({
				code: 'invalid',
				level: 'warning',
				message: `Found unknown release type (${v}); ignoring`,
				location: {
					type: 'metadata',
					property: 'releaseType',
				},
			});
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

	if (primaryType.size === 0) {
		diagnostics.push({
			code: 'missing',
			level: 'warning',
			message: `No primary types found; ignoring field`,
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
