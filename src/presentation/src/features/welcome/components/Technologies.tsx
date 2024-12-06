import { createSignal, onMount, Show } from "solid-js";
import type { ITechnologiesService } from "~/application/features/technologies/services/abstraction/ITechnologiesService";
import { Icons } from "~/domain/data/Icons";
import { Technology } from "~/domain/models/Technology";
import { Container } from "~/presentation/Container";
import NetworkGraph, { type Node } from "~/presentation/src/shared/components/NetworkGraph";
import IconSvgs from "~/presentation/src/shared/constants/IconSvgs";

const SVG_BLOB_TYPE = "image/svg+xml;charset=utf-8";

export default function Technologies() {
  const technologiesService: ITechnologiesService = Container.instance.technologiesService;

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
    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#9A9A9A";
    ctx.stroke();

    // Draw the icon
    ctx.drawImage(technologyIcon, node.x - 10, node.y - 10, 20, 20);

    // Write label
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(node.label, node.x, node.y + 30);
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
    <Show when={networkGraphData()}>
      <NetworkGraph nodes={networkGraphData()!} renderNode={drawNode} />
    </Show>
  );
}
