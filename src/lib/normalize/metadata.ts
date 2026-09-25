import type { FileResult } from '#lib/ingest/types.ts';
import type { Metadata } from '#lib/models/metadata.ts';
import type { Diagnostic } from '#shared/diagnostic.ts';
import { normalizeReleaseType } from './release-type.ts';

export function normalizeMetadata(file: Required<FileResult>): Metadata {
	const diagnostics: Diagnostic[] = [];
	diagnostics.push(...file.diagnostics);

	const rt = normalizeReleaseType(file.metadata.releaseType ?? []);
	for (const d of rt.diagnostics) {
		diagnostics.push(d);
	}

	return {
		path: file.path,
		data: {
			...file.metadata,
			title: file.metadata.title,
			releaseType: rt.value,
		},
		diagnostics,
	};
}
