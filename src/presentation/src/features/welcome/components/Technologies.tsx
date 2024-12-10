import { createSignal, onMount, Show } from "solid-js";
import type { ITechnologiesService } from "~/application/features/technologies/services/abstraction/ITechnologiesService";
import { Icons } from "~/domain/data/Icons";
import { TranslationKeys } from "~/domain/data/Translations";
import { Technology } from "~/domain/models/Technology";
import { Container } from "~/presentation/Container";
import NetworkGraph, { type Node } from "~/presentation/src/shared/components/NetworkGraph";
import Title from "~/presentation/src/shared/components/ui/Title";
import IconSvgs from "~/presentation/src/shared/constants/IconSvgs";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";

const SVG_BLOB_TYPE = "image/svg+xml;charset=utf-8";

export default function Technologies() {
  const technologiesService: ITechnologiesService = Container.instance.technologiesService;
  const translate = useI18n();
  let technologies: Technology[] | undefined;

  const [networkGraphData, setNetworkGraphData] = createSignal<Node[]>();

  onMount(() => {
    getData();
  });

  async function getData() {
    technologies = await technologiesService.getAll();

    const nodes: Node[] = technologies.map(
      (technology) =>
        ({
          id: technology.id.toString(),
          label: technology.name,
          edges: technology.linkedTechnologyIds?.map((t) => t.toString()) ?? [],
        }) as Node,
    );
    setNetworkGraphData(nodes);
  }

  //#region Draw Node
  const technologySvgIcons = new Map<string, HTMLImageElement>(); // NodeId -> SVG

  async function drawNode(node: Node, ctx: CanvasRenderingContext2D) {
    if (!node.x || !node.y) return;

    if (!technologySvgIcons.has(node.id)) {
      const technology = technologies!.find((t) => t.id.toString() === node.id);
      await getSvgIcon(node.id, technology!.icon);
    }

    const technologyIcon = technologySvgIcons.get(node.id)!;
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

  async function getSvgIcon(nodeId: string, icon: Icons) {
    if (technologySvgIcons.has(icon)) return;

    const iconSvg = IconSvgs[icon];
    const image = new Image();
    const svg = new Blob([iconSvg], { type: SVG_BLOB_TYPE });
    const url = URL.createObjectURL(svg);

    return new Promise<HTMLImageElement>((resolve) => {
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
        technologySvgIcons.set(nodeId, image);
      };
      image.src = url;
    });
  }
  //#endregion Draw Node

  return (
    <div class="size-full overflow-hidden">
      <Title>{translate(TranslationKeys.apps_welcome_technologiesIUse)}</Title>

      <Show when={networkGraphData()}>
        <NetworkGraph nodes={networkGraphData()!} renderNode={drawNode} />
      </Show>
    </div>
  );
}