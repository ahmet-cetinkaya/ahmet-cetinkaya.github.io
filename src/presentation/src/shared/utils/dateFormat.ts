import { useCurrentLocale } from "./i18nTranslate";

/**
 * Formats a date according to the given locale
 */
export function formatDate(date: Date, locale: string): string {
  // Map locale codes to full locale identifiers
  const localeMap: Record<string, string> = {
    en: "en-US",
    tr: "tr-TR",
  };

  const fullLocale = localeMap[locale] || locale;

  return date.toLocaleDateString(fullLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a date range according to the given locale
 * @param presentText - Text to display when endDate is null (defaults to "Present")
 */
export function formatDateRange(
  startDate: Date,
  endDate: Date | null | undefined,
  locale: string,
  presentText: string = "Present",
): string {
  const formattedStart = formatDate(startDate, locale);

  if (!endDate) {
    return `${formattedStart} - ${presentText}`;
  }

  const formattedEnd = formatDate(endDate, locale);
  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Hook that provides locale-aware date formatting functions
 * @returns Object with date formatting functions that automatically use current locale
 */
export function useDateFormatter() {
  const currentLocale = useCurrentLocale();

  return {
    formatDate: (date: Date) => formatDate(date, currentLocale()),
    formatDateRange: (startDate: Date, endDate: Date | null | undefined, presentText: string = "Present") =>
      formatDateRange(startDate, endDate, currentLocale(), presentText),
  };
}
