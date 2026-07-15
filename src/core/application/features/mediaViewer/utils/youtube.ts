const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"]);

/**
 * Extracts the 11-character video id from a YouTube URL.
 * Supports watch?v=<id>, youtu.be/<id>, and /embed/<id> forms. Returns null for
 * anything that is not a recognizable YouTube video URL.
 */
export function parseYouTubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return null;

  const candidate = extractIdFromParsedUrl(parsed, host);
  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

function extractIdFromParsedUrl(parsed: URL, host: string): string | null {
  if (host === "youtu.be" || host === "www.youtu.be") {
    return parsed.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  const watchId = parsed.searchParams.get("v");
  if (watchId) return watchId;

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments[0] === "embed" || segments[0] === "shorts") {
    return segments[1] ?? null;
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return parseYouTubeId(url) !== null;
}

export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
}
