import { logger } from "@application/shared/logger";
import { type RemoteContent, tryParseRemoteContent } from "@domain/data/remoteContent/remoteContent";
import type IFileSystemService from "./abstraction/IFileSystemService";

/** Caps the buffered body of a fetched remote resource to avoid unbounded memory use. */
const MAX_REMOTE_CONTENT_BYTES = 5 * 1024 * 1024;

/**
 * Centralizes `[RemoteContent]` envelope handling: reading a file's stored content,
 * parsing the envelope, and (when requested) fetching the real remote body. Both the
 * Text Editor and the Media Viewer depend on this so the read → parse → fetch flow —
 * and its error handling — lives in exactly one place instead of drifting across features.
 */
export default class RemoteContentResolver {
  constructor(private readonly fileSystemService: IFileSystemService) {}

  /**
   * Reads a file and returns its parsed `[RemoteContent]` envelope, or null when the
   * file is not a (valid) envelope. A malformed envelope is logged and treated as null
   * so a data-authoring error is visible in logs rather than silently mis-rendered.
   */
  async resolveEnvelope(path: string): Promise<RemoteContent | null> {
    const content = await this.fileSystemService.readFileContent(path);
    return this.parseEnvelope(content, path);
  }

  /** Parses already-read content into a `[RemoteContent]` envelope (null when not/malformed). */
  parseEnvelope(content: string, path?: string): RemoteContent | null {
    const result = tryParseRemoteContent(content);
    if (result.status === "malformed") {
      logger.warn(`Malformed [RemoteContent] envelope${path ? ` in ${path}` : ""}: ${result.reason}`);
      return null;
    }
    return result.status === "ok" ? result.remote : null;
  }

  /**
   * Fetches the real body of a remote-content envelope. Throws on network/HTTP failure
   * so callers surface an explicit error state rather than treating the failure as
   * legitimate file content. The URL has already been scheme/host-validated at parse time.
   */
  async fetchBody(remote: RemoteContent): Promise<string> {
    const response = await fetch(remote.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch remote content (${response.status}) from ${remote.url}`);
    }

    const contentLength = Number(response.headers.get("Content-Length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REMOTE_CONTENT_BYTES) {
      throw new Error(`Remote content too large (${contentLength} bytes) from ${remote.url}`);
    }

    const text = await response.text();
    if (text.length > MAX_REMOTE_CONTENT_BYTES) {
      throw new Error(`Remote content too large from ${remote.url}`);
    }
    return text;
  }
}
