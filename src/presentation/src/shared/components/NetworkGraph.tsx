import { createSignal, onCleanup, onMount, createMemo, createEffect } from "solid-js";

export type Node = {
  id: string;
  label: string;
  x?: number;
  y?: number;
  targetX?: number;
  targetY?: number;
  edges?: string[];
};

type Props = {
  nodes: Node[];
  renderNode?: (node: Node, context: CanvasRenderingContext2D) => void;
};

type State = {
  nodes: Node[];
  nodeDragging: { id: string; x: number; y: number } | null;
  isPanning: boolean;
  panOffset: { x: number; y: number };
  scale: number;
};

const layoutSettings = {
  repulsionForce: 50,
  attractionForce: 0.1,
  distanceThreshold: 100,
  minAttractionDistance: 150,
  springForce: 0.005,
  initialAnimationSpeed: 25,
  minAnimationSpeed: 5,
  animationSpeedDecreaseRate: 0.1,
  animationSpeedDecreaseInterval: 10,
  visualizationOpacityFactor: 0.5,
  nodeRadius: 15,
  canvasScaleMin: 0.1,
  canvasScaleMax: 5,
  canvasScaleStep: 0.001,
};

export default function NetworkGraph(props: Props) {
  const [state, setState] = createSignal<State>({
    nodes: props.nodes,
    nodeDragging: null,
    isPanning: false,
    panOffset: { x: 0, y: 0 },
    scale: 1,
  });

  const memoizedNodes = createMemo(() => state().nodes);

  let containerElement: HTMLDivElement | undefined;
  let canvasElement: HTMLCanvasElement | undefined;
  let canvasContext: CanvasRenderingContext2D | null = null;
  let animationSpeed = layoutSettings.initialAnimationSpeed;
  let animationFrameId: number | null = null;

  onMount(() => {
    initializeCanvas();
    beginAnimationSpeedThrottling();
    window.addEventListener("resize", resizeCanvas);
    observeContainerResize();

    onCleanup(() => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    });
  });

  createEffect(() => {
    if (canvasElement) drawGraph();
  });

  function onCanvasMount(el: HTMLCanvasElement) {
    canvasElement = el;
    canvasContext = canvasElement.getContext("2d");
    resizeCanvas();

    canvasElement.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvasElement.addEventListener("wheel", onWheel);

    onCleanup(() => {
      canvasElement!.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvasElement!.removeEventListener("wheel", onWheel);
    });
  }

  function initializeCanvas() {
    resizeCanvas();
    startAnimationLoop();
  }

  function startAnimationLoop() {
    const animate = () => {
      drawGraph();
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
  }

  function beginAnimationSpeedThrottling() {
    const decreaseAnimationSpeed = setInterval(() => {
      if (animationSpeed > layoutSettings.minAnimationSpeed)
        animationSpeed -= layoutSettings.animationSpeedDecreaseRate;
      else clearInterval(decreaseAnimationSpeed);
    }, layoutSettings.animationSpeedDecreaseInterval);
  }

  function observeContainerResize() {
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (containerElement) resizeObserver.observe(containerElement);
    onCleanup(() => resizeObserver.disconnect());
  }

  function applyForces() {
    if (!canvasElement) return;

    const centerX = canvasElement.width / 2;
    const centerY = canvasElement.height / 2;
    if (!centerX && !centerY) return;

    positionNodes(centerX, centerY);
    applyRepulsionForces();
    applyAttractionForces();
    applySpringForces();
  }

  function positionNodes(centerX: number, centerY: number) {
    const positionedNodes = new Set<string>();

    const orderNodes = (node: Node, length: number, index: number, radius: number) => {
      if (node.x && node.y) return;

      // Position the node in a circle around the center
      const angle = (index / length) * 2 * Math.PI; // Distribute nodes evenly around the circle
      let x = centerX + radius * Math.cos(angle);
      let y = centerY + radius * Math.sin(angle);

      // Check all directions for an empty spot
      let foundEmptySpot = false;
      for (let i = 0; i < 360; i += 10) {
        // Check every 10 degrees
        const testAngle = (i / 360) * 2 * Math.PI;
        const testX = centerX + radius * Math.cos(testAngle);
        const testY = centerY + radius * Math.sin(testAngle);

        // Euclidean distance between nodes
        if (!memoizedNodes().some((n) => Math.hypot(n.x! - testX, n.y! - testY) < 50)) {
          x = testX;
          y = testY;
          foundEmptySpot = true;
          break;
        }
      }

      // If no completely empty spot is found, use the existing logic to find a spot with some distance
      if (!foundEmptySpot) {
        while (memoizedNodes().some((n) => Math.hypot(n.x! - x, n.y! - y) < 50)) {
          radius += 10;
          x = centerX + radius * Math.cos(angle);
          y = centerY + radius * Math.sin(angle);
        }
      }

      node.x = x;
      node.y = y;
      positionedNodes.add(node.id);

      const connectedNodes = memoizedNodes().filter((n) => n.edges && n.edges.includes(node.id));
      connectedNodes.forEach((connectedNode, connectedIndex) =>
        orderNodes(connectedNode, connectedNodes.length, connectedIndex, radius),
      );
    };

    const nodesWithoutEdges = memoizedNodes().filter((n) => !n.edges || n.edges.length === 0);
    nodesWithoutEdges.forEach((node, index) => orderNodes(node, nodesWithoutEdges.length, index, 200));
  }

  function applyRepulsionForces() {
    const { repulsionForce, distanceThreshold, visualizationOpacityFactor } = layoutSettings;

    memoizedNodes().forEach((nodeA, indexA) => {
      memoizedNodes().forEach((nodeB, indexB) => {
        if (indexA === indexB) return;
        if (nodeA.x === undefined || nodeA.y === undefined || nodeB.x === undefined || nodeB.y === undefined) return;

        // Calculate the distance between nodes
        const distanceX = nodeA.x - nodeB.x;
        const distanceY = nodeA.y - nodeB.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < distanceThreshold) {
          // Calculate the repulsion force
          const force = repulsionForce / (distance * distance);
          const angle = Math.atan2(distanceY, distanceX);

          // Apply the repulsion force to both nodes
          const visualizationOpacity = visualizationOpacityFactor * animationSpeed;
          nodeA.x += force * Math.cos(angle) * visualizationOpacity;
          nodeA.y += force * Math.sin(angle) * visualizationOpacity;
          nodeB.x -= force * Math.cos(angle) * visualizationOpacity;
          nodeB.y -= force * Math.sin(angle) * visualizationOpacity;
        }
      });
    });
  }

  function applyAttractionForces() {
    const { attractionForce, minAttractionDistance } = layoutSettings;

    memoizedNodes().forEach((node) => {
      if (!node.edges) return;
      node.edges.forEach((edgeTargetNodeId) => {
        const targetNode = memoizedNodes().find((n) => n.id === edgeTargetNodeId);
        if (
          !targetNode ||
          targetNode.x === undefined ||
          targetNode.y === undefined ||
          node.x === undefined ||
          node.y === undefined
        )
          return;

        const distanceX = targetNode.x - node.x;
        const distanceY = targetNode.y - node.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance > minAttractionDistance) {
          const force = attractionForce * (distance - minAttractionDistance);
          const angle = Math.atan2(distanceY, distanceX);

          node.x += force * Math.cos(angle);
          node.y += force * Math.sin(angle);
          targetNode.x -= force * Math.cos(angle);
          targetNode.y -= force * Math.sin(angle);
        }
      });
    });
  }

  function applySpringForces() {
    const { springForce } = layoutSettings;

    memoizedNodes().forEach((node) => {
      if (node.targetX === undefined || node.targetY === undefined) return;
      if (node.x === undefined || node.y === undefined) return;

      // Move the node towards its target position
      node.x += (node.targetX - node.x) * springForce;
      node.y += (node.targetY - node.y) * springForce;
    });
  }

  function drawGraph() {
    if (!canvasContext) return;
    if (!props.nodes) return;

    canvasContext.clearRect(0, 0, canvasElement!.width, canvasElement!.height);

    applyForces();

    canvasContext.save();
    canvasContext.scale(state().scale, state().scale);

    drawEdges();
    drawNodes();

    canvasContext.restore();
  }

  function drawEdges() {
    memoizedNodes().forEach((node) => {
      if (!node.edges) return;
      if (!canvasContext) return;

      node.edges.forEach((edgeTargetNodeId) => {
        const sourceNode = memoizedNodes().find((n) => n.id === node.id);
        const targetNode = memoizedNodes().find((n) => n.id === edgeTargetNodeId);
        if (!sourceNode || !targetNode) return;
        if (
          sourceNode.x === undefined ||
          sourceNode.y === undefined ||
          targetNode.x === undefined ||
          targetNode.y === undefined
        )
          return;

        canvasContext!.beginPath();
        canvasContext!.moveTo(sourceNode.x, sourceNode.y);
        if (state().nodeDragging?.id === node.id || state().nodeDragging?.id === edgeTargetNodeId)
          canvasContext!.strokeStyle = "yellow";
        else canvasContext!.strokeStyle = "gray";
        canvasContext!.lineWidth = 1;
        canvasContext!.lineTo(targetNode.x, targetNode.y);
        canvasContext!.stroke();
      });
    });
  }

  function drawNodes() {
    memoizedNodes().forEach((node) => {
      if (!canvasContext) return;
      if (node.x === undefined || node.y === undefined) return;
      if (props.renderNode) return props.renderNode(node, canvasContext!);

      canvasContext.beginPath();
      canvasContext.fillStyle = "black";
      canvasContext.arc(node.x, node.y, layoutSettings.nodeRadius, 0, 2 * Math.PI);
      canvasContext.fill();
      canvasContext.fillText(node.label, node.x - 15, node.y + 30);
    });
  }

  function resizeCanvas() {
    if (!canvasElement) return;
    canvasElement.width = canvasElement.parentElement!.clientWidth;
    canvasElement.height = canvasElement.parentElement!.clientHeight;
    drawGraph();
  }

  function onMouseDown(event: MouseEvent, node?: Node) {
    const scale = state().scale;
    if (node) handleNodeDraggingOnMouseDown(node, event, scale);
    else handleCanvasPanningOnMouseDown(event);
  }

  function handleNodeDraggingOnMouseDown(node: Node, event: MouseEvent, scale: number) {
    setState((prevState) => ({
      ...prevState,
      nodeDragging: { id: node.id, x: event.clientX / scale, y: event.clientY / scale },
    }));
  }

  function handleCanvasPanningOnMouseDown(event: MouseEvent) {
    setState((prevState) => ({
      ...prevState,
      isPanning: true,
      panOffset: { x: event.clientX, y: event.clientY },
    }));
  }

  function onMouseMove(event: MouseEvent) {
    const scale = state().scale;
    if (state().nodeDragging?.id) handleDraggingOnMouseMove(event, scale);
    else if (state().isPanning) handleCanvasPanningOnMouseMove(event, scale);
  }

  function handleDraggingOnMouseMove(event: MouseEvent, scale: number) {
    const rect = canvasElement!.getBoundingClientRect();
    const newX = (event.clientX - rect.left) / scale;
    const newY = (event.clientY - rect.top) / scale;

    setState((prevState) => ({
      ...prevState,
      nodes: memoizedNodes().map((node) =>
        node.id === state().nodeDragging!.id ? { ...node, x: newX, y: newY } : node,
      ),
      nodeDragging: { ...state().nodeDragging!, x: newX, y: newY },
    }));
    drawGraph();
  }

  function handleCanvasPanningOnMouseMove(event: MouseEvent, scale: number) {
    const distanceX = event.clientX - state().panOffset.x;
    const distanceY = event.clientY - state().panOffset.y;

    setState((prevState) => ({
      ...prevState,
      nodes: memoizedNodes().map((node) => ({
        ...node,
        x: node.x! + distanceX / scale,
        y: node.y! + distanceY / scale,
      })),
      panOffset: { x: event.clientX, y: event.clientY },
    }));
    drawGraph();
  }

  function onMouseUp() {
    // Stop dragging nodes or panning
    setState({ ...state(), nodeDragging: null, isPanning: false });
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault();
    const scaleAmount = -event.deltaY * layoutSettings.canvasScaleStep;
    setState((prevState) => ({
      ...prevState,
      scale: Math.min(
        Math.max(prevState.scale + scaleAmount, layoutSettings.canvasScaleMin),
        layoutSettings.canvasScaleMax,
      ),
    }));
    drawGraph();
  }

  return (
    <div ref={containerElement} class="relative size-full">
      <canvas
        ref={onCanvasMount}
        class="block size-full"
        onMouseDown={(event) => {
          const scale = state().scale;
          const rect = canvasElement!.getBoundingClientRect();
          const x = (event.clientX - rect.left) / scale;
          const y = (event.clientY - rect.top) / scale;
          const node = memoizedNodes().find((node) => Math.hypot(node.x! - x, node.y! - y) < layoutSettings.nodeRadius);
          onMouseDown(event, node);
        }}
      />
    </div>
  );
}
