import { createResource, Show, createMemo } from "solid-js";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import Technology from "@domain/models/Technology";
import Container from "@presentation/Container";
import NetworkGraph, { type Node } from "@packages/acore-solidjs/ui/components/NetworkGraph";
import Title from "@shared/components/ui/Title";
import IconSvgs from "@shared/constants/IconSvgs";
import { useI18n } from "@shared/utils/i18nTranslate";
import { logger } from "@shared/utils/logger";

const SVG_BLOB_TYPE = "image/svg+xml;charset=utf-8";

// Function to fetch SVG content from file path (borrowed from Icon component)
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

export default function Technologies() {
  const { technologiesService } = Container.instance;
  const translate = useI18n();
  let technologies: Technology[] | undefined;

  const [networkGraphData] = createResource(getTechNetworkGraphData);
  const memoizedNetworkGraphData = createMemo(() => networkGraphData());

  async function getTechNetworkGraphData() {
    technologies = await technologiesService.getAll();
    const nodes: Node[] = technologies!.map(
      (technology) =>
        ({
          id: technology.id.toString(),
          label: technology.name,
          edges: technology.linkedTechnologyIds?.map((t) => t.toString()) ?? [],
        }) as Node,
    );
    return nodes;
  }

  //#region Draw Node
  const technologySvgIcons = new Map<string, HTMLImageElement>(); // NodeId -> SVG

  async function drawNode(node: Node, ctx: CanvasRenderingContext2D) {
    if (!node.x || !node.y) return;

    let technologyIcon: HTMLImageElement | undefined = technologySvgIcons.get(node.id);

    // If we don't have the icon cached, try to load it
    if (!technologyIcon) {
      const technology = technologies!.find((t) => t.id.toString() === node.id);
      if (!technology) {
        logger.warn(`Technology not found for node ${node.id}`);
        return;
      }

      try {
        const loadedIcon = await getSvgIcon(node.id, technology.icon);
        if (!loadedIcon) {
          // If icon failed to load, draw a fallback placeholder
          drawFallbackNode(node, ctx);
          return;
        }
        technologyIcon = loadedIcon;
      } catch (error) {
        logger.error(`Failed to load icon for node ${node.id}:`, error);
        drawFallbackNode(node, ctx);
        return;
      }
    }

    // Draw circular background
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#9A9A9A";
    ctx.stroke();

    // Draw the icon
    ctx.drawImage(technologyIcon, node.x - 15, node.y - 15, 30, 30);

    // Write label
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(node.label, node.x, node.y + 35);
  }

  // Fallback drawing function when SVG loading fails
  function drawFallbackNode(node: Node, ctx: CanvasRenderingContext2D) {
    if (!node.x || !node.y) return;

    // Draw circular background with error indication
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, Math.PI * 2, true);
    ctx.fillStyle = "#ff6b6b"; // Light red background for error state
    ctx.fill();
    ctx.strokeStyle = "#ff4444";
    ctx.stroke();

    // Draw a simple "X" icon as fallback
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(node.x - 10, node.y - 10);
    ctx.lineTo(node.x + 10, node.y + 10);
    ctx.moveTo(node.x + 10, node.y - 10);
    ctx.lineTo(node.x - 10, node.y + 10);
    ctx.stroke();
    ctx.lineWidth = 1; // Reset line width

    // Write label
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(node.label, node.x, node.y + 35);
  }

  async function getSvgIcon(nodeId: string, icon: Icons): Promise<HTMLImageElement | null> {
    // Check if we already cached this icon for this node
    if (technologySvgIcons.has(nodeId)) {
      return technologySvgIcons.get(nodeId)!;
    }

    const iconSvg = IconSvgs[icon];
    if (!iconSvg) {
      logger.warn(`Icon "${icon}" not found in IconSvgs mapping`);
      return null;
    }

    try {
      let svgContent: string;

      // Check if it's a file path or inline SVG
      const isFilePath = iconSvg.startsWith("/") || iconSvg.startsWith("./") || iconSvg.startsWith("http");

      if (isFilePath) {
        // Fetch SVG content from file
        svgContent = await fetchSvgContent(iconSvg);
        if (!svgContent) {
          logger.warn(`Failed to load SVG content for icon "${icon}" from path: ${iconSvg}`);
          return null;
        }
      } else {
        // Use inline SVG content directly
        svgContent = iconSvg;
      }

      // Create image from SVG content
      const image = new Image();
      const svg = new Blob([svgContent], { type: SVG_BLOB_TYPE });
      const url = URL.createObjectURL(svg);

      return new Promise<HTMLImageElement>((resolve, reject) => {
        // Set up timeout to handle hanging image loads
        const timeout = setTimeout(() => {
          URL.revokeObjectURL(url);
          reject(new Error(`Timeout loading icon "${icon}"`));
        }, 10000); // 10 second timeout

        image.onload = () => {
          clearTimeout(timeout);
          URL.revokeObjectURL(url);
          technologySvgIcons.set(nodeId, image);
          resolve(image);
        };

        image.onerror = () => {
          clearTimeout(timeout);
          URL.revokeObjectURL(url);
          logger.error(`Failed to load image for icon "${icon}"`);
          reject(new Error(`Failed to load image for icon "${icon}"`));
        };

        image.src = url;
      });
    } catch (error) {
      logger.error(`Error processing SVG icon "${icon}":`, error);
      return null;
    }
  }
  //#endregion Draw Node

  return (
    <div class="size-full overflow-hidden">
      <Title class="px-8 py-4">{translate(TranslationKeys.apps_welcome_technologiesIUse)}</Title>

      <Show when={memoizedNetworkGraphData()}>
        <div aria-label="Technology network visualization">
          <p class="sr-only">
            Interactive network visualization of technologies I use, including:{" "}
            {technologies?.map((technology) => technology.name).join(", ")}
          </p>
        </div>

        <NetworkGraph
          nodes={memoizedNetworkGraphData()!}
          renderNode={drawNode}
          centerButtonTitle={`${translate(TranslationKeys.apps_welcome_technologies_center_graph)} (Ctrl+Shift+C)`}
        />
      </Show>
    </div>
  );
}
