export enum RemoteContentType {
  JAVASCRIPT = "javascript",
  WASM = "wasm",
  VIDEO = "video",
}

export type RemoteContent = {
  type: RemoteContentType;
  format: string;
  url: string;
};

const REMOTE_CONTENT_HEADER = "[RemoteContent]";
const TYPE_KEY_PATTERN = /^\s*type\s*=\s*(.+?)\s*$/im;
const FORMAT_KEY_PATTERN = /^\s*format\s*=\s*(.+?)\s*$/im;
const URL_KEY_PATTERN = /^\s*url\s*=\s*(.+?)\s*$/im;

/**
 * Detects the `[RemoteContent]` envelope used to describe a file whose real
 * content lives at a remote URL (e.g. seeded library/media files). Mirrors the
 * INI-style `.desktop`/`.url` shortcut conventions already used in this codebase.
 */
export function isRemoteContent(content: string): boolean {
  return content.trimStart().startsWith(REMOTE_CONTENT_HEADER);
}

/** Parses a `[RemoteContent]` envelope. Returns null when the content isn't a valid envelope. */
export function parseRemoteContent(content: string): RemoteContent | null {
  if (!isRemoteContent(content)) return null;

  const type = content.match(TYPE_KEY_PATTERN)?.[1]?.trim();
  const format = content.match(FORMAT_KEY_PATTERN)?.[1]?.trim();
  const url = content.match(URL_KEY_PATTERN)?.[1]?.trim();
  if (!type || !format || !url) return null;
  if (!Object.values(RemoteContentType).includes(type as RemoteContentType)) return null;

  return { type: type as RemoteContentType, format, url };
}

/** Serializes a {@link RemoteContent} into its `[RemoteContent]` envelope text form. */
export function serializeRemoteContent(remote: RemoteContent): string {
  return `${REMOTE_CONTENT_HEADER}\nType=${remote.type}\nFormat=${remote.format}\nUrl=${remote.url}`;
}
