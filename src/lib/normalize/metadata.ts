import path from 'node:path';
import type { Diagnostic } from '../../shared/diagnostic';
import type { FileResult } from '../ingest/types';
import type { Metadata } from '../models/metadata';
import { normalizeReleaseType } from './release-type.ts';

export function normalizeMetadata(file: Required<FileResult>): Metadata {
	const diagnostics: Diagnostic[] = [];
	diagnostics.push(...file.diagnostics);

	const rt = normalizeReleaseType(file.metadata.releaseType ?? []);
	diagnostics.push(...rt.diagnostics);

	return {
		path: file.path,
		data: {
			...file.metadata,
			title: file.metadata.title
				|| path.basename(file.path, path.extname(file.path)),
			releaseType: rt.value,
		},
		diagnostics,
	};
}
