import { FILE_TYPE_PATTERNS } from "@application/features/fileExplorer/constants";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import File from "@domain/models/File";

export type MediaKind = "image" | "video" | "audio" | "youtube";

const YOUTUBE_SHORTCUT_PATTERN = /\.url$/i;

/**
 * Classifies files the Media Viewer can render. Reuses the file explorer's
 * extension patterns (FILE_TYPE_PATTERNS) so the supported extension lists stay
 * defined in a single place.
 */
export default class MediaFileService {
  isMediaFile(entry: FileSystemEntry): boolean {
    return this.getMediaKind(entry) !== null;
  }

  getMediaKind(entry: FileSystemEntry): MediaKind | null {
    if (!(entry instanceof File)) return null;
    return getMediaKindForFileName(entry.name);
  }
}

export function getMediaKindForFileName(fileName: string): MediaKind | null {
  if (FILE_TYPE_PATTERNS.IMAGES.test(fileName)) return "image";
  if (FILE_TYPE_PATTERNS.VIDEOS.test(fileName)) return "video";
  if (FILE_TYPE_PATTERNS.AUDIO.test(fileName)) return "audio";
  if (YOUTUBE_SHORTCUT_PATTERN.test(fileName)) return "youtube";
  return null;
}
