/**
 * A thin wrapper around TagLib.
 *
 * This layer should be the **only** place that knows TagLib exists.
 * @module
 */

import { scanFolder } from 'taglib-wasm/folder';
import { parseFile } from './taglib';
import type { FileResult } from './types';

export type { FileResult, RawMetadata } from './types';

export async function* scan(root = '.'): AsyncGenerator<FileResult> {
	const { items } = await scanFolder(root);

	for (const item of items) {
		yield parseFile(item);
	}
}
