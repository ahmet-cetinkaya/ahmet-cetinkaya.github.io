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

/** Outcome of {@link tryParseRemoteContent}, distinguishing "not an envelope" from a malformed one. */
export type ParseRemoteContentResult =
  { status: "ok"; remote: RemoteContent } | { status: "not-remote-content" } | { status: "malformed"; reason: string };

const REMOTE_CONTENT_HEADER = "[RemoteContent]";

/** Envelope field names. Shared by the serializer and parser so the two halves cannot drift. */
const KEYS = { TYPE: "Type", FORMAT: "Format", URL: "Url" } as const;

/**
 * Only these schemes/hosts may be fetched. The envelope URL is author-seeded today,
 * but validating here keeps an unexpected/attacker-influenced URL (e.g. via a
 * compromised source repo) from ever reaching `fetch()` or a media `src`.
 * Mirrors the host-allowlist approach used by the YouTube utils.
 */
const ALLOWED_REMOTE_HOSTS = new Set([
  "raw.githubusercontent.com",
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

function buildKeyPattern(key: string): RegExp {
  return new RegExp(`^\\s*${key}\\s*=\\s*(.+?)\\s*$`, "im");
}

const TYPE_KEY_PATTERN = buildKeyPattern(KEYS.TYPE);
const FORMAT_KEY_PATTERN = buildKeyPattern(KEYS.FORMAT);
const URL_KEY_PATTERN = buildKeyPattern(KEYS.URL);

function isRemoteContentType(value: string): value is RemoteContentType {
  return Object.values(RemoteContentType).includes(value as RemoteContentType);
}

/** Validates that a URL is an https URL pointing at an allowlisted host. */
function isAllowedRemoteUrl(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }
  return parsed.protocol === "https:" && ALLOWED_REMOTE_HOSTS.has(parsed.hostname.toLowerCase());
}

/**
 * Detects the `[RemoteContent]` envelope used to describe a file whose real
 * content lives at a remote URL (e.g. seeded library/media files). Mirrors the
 * INI-style `.desktop`/`.url` shortcut conventions already used in this codebase.
 */
export function isRemoteContent(content: string): boolean {
  return content.trimStart().startsWith(REMOTE_CONTENT_HEADER);
}

/**
 * Parses a `[RemoteContent]` envelope into a discriminated result. Callers that
 * only care about the happy path can use {@link parseRemoteContent}; those that
 * want to surface authoring errors (malformed envelope) inspect the status.
 */
export function tryParseRemoteContent(content: string): ParseRemoteContentResult {
  if (!isRemoteContent(content)) return { status: "not-remote-content" };

  const type = content.match(TYPE_KEY_PATTERN)?.[1]?.trim();
  const format = content.match(FORMAT_KEY_PATTERN)?.[1]?.trim();
  const url = content.match(URL_KEY_PATTERN)?.[1]?.trim();
  if (!type || !format || !url) {
    return { status: "malformed", reason: "missing Type, Format, or Url field" };
  }
  if (!isRemoteContentType(type)) {
    return { status: "malformed", reason: `unknown RemoteContentType "${type}"` };
  }
  if (!isAllowedRemoteUrl(url)) {
    return { status: "malformed", reason: `URL is not an allowed https remote: "${url}"` };
  }

  return { status: "ok", remote: { type, format, url } };
}

/** Parses a `[RemoteContent]` envelope. Returns null when the content isn't a valid envelope. */
export function parseRemoteContent(content: string): RemoteContent | null {
  const result = tryParseRemoteContent(content);
  return result.status === "ok" ? result.remote : null;
}

/** Serializes a {@link RemoteContent} into its `[RemoteContent]` envelope text form. */
export function serializeRemoteContent(remote: RemoteContent): string {
  return `${REMOTE_CONTENT_HEADER}\n${KEYS.TYPE}=${remote.type}\n${KEYS.FORMAT}=${remote.format}\n${KEYS.URL}=${remote.url}`;
}
