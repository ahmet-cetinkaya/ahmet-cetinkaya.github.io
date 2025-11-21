import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import WallpaperPaths from "@shared/constants/WallpaperPaths";
import { createSignal, onMount, onCleanup } from "solid-js";

type Props = {
  class?: string;
};

export default function Wallpaper(props: Props) {
  const layer1 = WallpaperPaths.getLayer1Paths();
  const layer2 = WallpaperPaths.getLayer2Paths();

  // Mouse tracking signals for parallax effects
  const [, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [transform2, setTransform2] = createSignal({ x: 0, y: 0 });

  // Parallax intensity settings
  const PARALLAX_INTENSITY_LAYER_2 = 0.05; // Increased movement for layer 2 only

  // Throttle function to prevent excessive updates
  let throttleTimeout: ReturnType<typeof setTimeout> | null = null;
  const THROTTLE_DELAY = 16; // ~60fps

  function throttle(callback: () => void) {
    if (throttleTimeout) return;
    throttleTimeout = setTimeout(() => {
      callback();
      throttleTimeout = null;
    }, THROTTLE_DELAY);
  }

  function handleMouseMove(event: MouseEvent) {
    throttle(() => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      // Calculate normalized mouse position (-1 to 1)
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);

      setMousePosition({ x, y });

      // Apply parallax transformation only to layer 2
      setTransform2({
        x: x * PARALLAX_INTENSITY_LAYER_2 * 100,
        y: y * PARALLAX_INTENSITY_LAYER_2 * 100,
      });
    });
  }

  function handleMouseLeave() {
    // Reset to center when mouse leaves
    setMousePosition({ x: 0, y: 0 });
    setTransform2({ x: 0, y: 0 });
  }

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
  });

  onCleanup(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseleave", handleMouseLeave);
    if (throttleTimeout) {
      clearTimeout(throttleTimeout);
    }
  });

  return (
    <div class={mergeCls("relative size-full overflow-hidden", props.class)}>
      {/* Background layer 2 - bottom layer with parallax */}
      <div
        class="wallpaper-bg-2 absolute inset-0 size-full bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          "background-image": `url("${layer2.large}")`,
          "z-index": "-50",
          transform: `translate(${transform2().x}px, ${transform2().y}px)`,
        }}
      />
      {/* Background layer 1 - top layer positioned from top - no parallax */}
      <div
        class="wallpaper-bg-1 absolute inset-x-0 top-96 h-screen bg-cover bg-top"
        style={{
          "background-image": `url("${layer1.large}")`,
          "z-index": "-40",
        }}
      />

      {/* Responsive styles handled in a style tag */}
      <style>{`
        @media (max-width: 720px) {
          .wallpaper-bg-1 {
            background-image: url("${layer1.small}") !important;
          }
          .wallpaper-bg-2 {
            background-image: url("${layer2.small}") !important;
          }
          /* Disable parallax on mobile for performance */
          .wallpaper-bg-2 {
            transform: none !important;
          }
        }
        @media (max-width: 1080px) {
          .wallpaper-bg-1 {
            background-image: url("${layer1.medium}") !important;
          }
          .wallpaper-bg-2 {
            background-image: url("${layer2.medium}") !important;
          }
          /* Reduce parallax intensity on tablet */
          .wallpaper-bg-2 {
            transform: translate(calc(${transform2().x}px * 0.5), calc(${transform2().y}px * 0.5)) !important;
          }
        }

        /* Smooth transitions for better UX */
        .wallpaper-bg-2 {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
