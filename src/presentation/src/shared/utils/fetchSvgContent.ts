import { logger } from "@application/shared/logger";

const SVG_BLOB_TYPE = "image/svg+xml;charset=utf-8";

/**
 * Fetch SVG content from a file path
 */
export async function fetchSvgContent(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      logger.warn(`Failed to load SVG: ${filePath} (${response.status})`);
      return "";
    }
    const text = await response.text();
    const match = text.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
    return match ? match[0] : "";
  } catch (error) {
    logger.error(`Error loading SVG ${filePath}:`, error);
    return "";
  }
}

/**
 * Create an HTMLImageElement from SVG content string
 */
export function createSvgImage(svgContent: string): Promise<HTMLImageElement> {
  const image = new Image();
  const svg = new Blob([svgContent], { type: SVG_BLOB_TYPE });
  const url = URL.createObjectURL(svg);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error("Timeout loading SVG image"));
    }, 10000);

    image.onload = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG image"));
    };

    image.src = url;
  });
}
