const URL_KEY_PATTERN = /^\s*url\s*=\s*(.+?)\s*$/im;
const RAW_URL_PATTERN = /^https?:\/\//i;

/**
 * Extracts the target URL from a `.url` shortcut file. Supports the Windows
 * `[InternetShortcut]` INI form (`URL=...`) as well as a bare URL as the file's
 * only content. Returns null when no URL can be found.
 */
export function extractShortcutUrl(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) return null;

  const keyed = trimmed.match(URL_KEY_PATTERN)?.[1]?.trim();
  if (keyed) return keyed;

  const firstLine = trimmed.split(/\r?\n/)[0]?.trim() ?? "";
  return RAW_URL_PATTERN.test(firstLine) ? firstLine : null;
}
