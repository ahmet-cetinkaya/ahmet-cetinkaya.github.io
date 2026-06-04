import Icons from "@domain/data/Icons";
import IconSvgs from "@shared/constants/IconSvgs";
import { createMemo, createResource, Show } from "solid-js";
import SvgIcon from "@packages/acore-solidjs/ui/components/SvgIcon";
import { logger } from "@shared/utils/logger";

type Props = {
  icon: Icons;
  isSpin?: boolean;
  onClick?: () => void;
  class?: string;
  fillColor?: string;
};

// Function to fetch SVG content from file path
async function fetchSvgContent(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      logger.warn(`Failed to load SVG: ${filePath} (${response.status})`);
      return "";
    }
    const text = await response.text();
    // Extract SVG content from the response
    const match = text.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
    return match ? match[0] : "";
  } catch (error) {
    logger.error(`Error loading SVG ${filePath}:`, error);
    return "";
  }
}

export default function Icon(props: Props) {
  const iconData = createMemo(() => {
    const svg = IconSvgs[props.icon];
    if (!svg) {
      logger.warn(`Icon "${props.icon}" not found in IconSvgs mapping`);
      return IconSvgs[Icons.code] || ""; // Fallback to code icon or empty string
    }
    return svg;
  });

  const isFilePath = createMemo(() => {
    return iconData().startsWith("/") || iconData().startsWith("./") || iconData().startsWith("http");
  });

  // Create resource to fetch SVG content for file paths
  const [svgContent] = createResource(
    () => (isFilePath() ? fetchSvgContent(iconData()) : iconData()),
    (data) => data,
  );

  return (
    <Show
      when={svgContent()}
      fallback={
        <div
          class={`inline-block h-5 w-5 select-none ${props.class || ""} ${props.isSpin ? "animate-spin" : ""}`}
          onClick={props.onClick}
        />
      }
    >
      {(content) => (
        <SvgIcon
          svg={content()}
          alt={props.icon}
          isSpin={props.isSpin}
          onClick={props.onClick}
          class={props.class}
          fillColor={props.fillColor}
        />
      )}
    </Show>
  );
}
