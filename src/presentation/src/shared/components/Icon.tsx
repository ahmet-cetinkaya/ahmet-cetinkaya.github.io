import Icons from "@domain/data/Icons";
import IconSvgs from "@shared/constants/IconSvgs";
import { createMemo, createResource, Show } from "solid-js";
import SvgIcon from "@packages/acore-solidjs/ui/components/SvgIcon";
import { logger } from "@shared/utils/logger";
import { fetchSvgContent } from "@shared/utils/fetchSvgContent";

type Props = {
  icon: Icons;
  isSpin?: boolean;
  onClick?: () => void;
  class?: string;
  fillColor?: string;
  preserveFill?: boolean;
};

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
          preserveFill={props.preserveFill}
          onClick={props.onClick}
          styles={{ wrapper: props.class }}
          fillColor={props.fillColor}
        />
      )}
    </Show>
  );
}
