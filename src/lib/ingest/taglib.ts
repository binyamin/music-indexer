import { isTagLibError } from 'taglib-wasm';
import type { FolderScanItem } from 'taglib-wasm/folder';
import type { Diagnostic } from '../../shared/diagnostic.ts';
import type { FileResult, RawMetadata } from './types.ts';

export function parseFile(file: FolderScanItem): FileResult {
	if (file.status === 'ok') {
		const diagnostics: Diagnostic[] = [];

		const metadata: RawMetadata = {
			album: file.tags.album?.[0],
			albumArtists: file.tags.albumArtist,
			artists: file.tags.artist,
			composer: file.tags.composer,
			disc: file.tags.discNumber
				? {
					no: file.tags.discNumber,
					of: file.tags.totalDiscs,
				}
				: undefined,
			duration: file.properties!.duration,
			genre: file.tags.genre,
			isrc: file.tags.isrc?.[0],
			label: file.tags.label?.[0],
			lyricist: file.tags.lyricist,
			releaseDate: [file.tags.date].flat()?.[0]
				?? file.tags.year?.toString(),
			releaseType: file.tags[
				'RELEASETYPE' as keyof typeof file.tags
			] as string[],
			title: file.tags.title?.[0],
			track: file.tags.track
				? {
					no: file.tags.track,
					of: file.tags.totalTracks,
				}
				: undefined,
		};

		return {
			path: file.path,
			metadata,
			diagnostics,
		};
	} else {
		// It's an error
		let diag: Diagnostic;

		if (isTagLibError(file.error)) {
			switch (file.error.code) {
				case 'UNSUPPORTED_FORMAT':
					diag = {
						code: 'unsupported',
						level: 'error',
						message: file.error.message,
						location: {
							type: 'file',
							path: file.path,
						},
					};
					break;
				case 'INVALID_FORMAT':
					diag = {
						code: 'invalid',
						level: 'error',
						message: file.error.message,
						location: {
							type: 'file',
							path: file.path,
						},
					};
					break;
				case 'METADATA':
					diag = {
						code: 'invalid',
						level: 'error',
						message: file.error.message,
						location: {
							type: 'file',
							path: file.path,
						},
					};
					break;
				default:
					throw file.error;
			}

			return {
				path: file.path,
				diagnostics: [diag],
			};
		}

		throw file.error;
	}
}
