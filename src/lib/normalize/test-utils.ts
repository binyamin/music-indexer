import type { FileResult, RawMetadata } from '../ingest/types';

export function makeFile(
	overrides: Partial<Omit<FileResult, 'metadata'>> & {
		metadata?: Partial<RawMetadata>;
	} = {},
): Required<FileResult> {
	return {
		path: '/music/Greatest Hits/01 - Yesterday.mp3',
		diagnostics: [],
		...overrides,
		metadata: {
			duration: 240,
			...overrides.metadata,
		} satisfies RawMetadata,
	};
}
