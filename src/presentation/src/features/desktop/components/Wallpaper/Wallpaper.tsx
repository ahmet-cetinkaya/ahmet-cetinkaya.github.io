import { createSignal, onCleanup, onMount } from "solid-js";
import AnimationHelper from "@packages/acore-ts/ui/animation/AnimationHelper";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import Position from "@packages/acore-ts/ui/models/Position";
import Image from "@packages/acore-solidjs/ui/components/Image";
import BackgroundPart1 from "./assets/images/ahmet-cetinkaya-code-space-wallpaper/part-1_optimized.webp";
import BackgroundPart1Medium from "./assets/images/ahmet-cetinkaya-code-space-wallpaper/part-1_optimized-1080.webp";
import BackgroundPart1Small from "./assets/images/ahmet-cetinkaya-code-space-wallpaper/part-1_optimized-720.webp";
import BackgroundPart2 from "./assets/images/ahmet-cetinkaya-code-space-wallpaper/part-2_optimized.webp";
import BackgroundPart2Medium from "./assets/images/ahmet-cetinkaya-code-space-wallpaper/part-2_optimized-1080.webp";
import BackgroundPart2Small from "./assets/images/ahmet-cetinkaya-code-space-wallpaper/part-2_optimized-720.webp";

type Props = {
  class?: string;
};

export default function Wallpaper(props: Props) {
  const [backgroundPosition, setBackgroundPosition] = createSignal<Position | undefined>();
  let animationFrameId: number | null = null;

  onMount(() => {
    document.addEventListener("mousemove", handleMouseMove);
  });

  onCleanup(() => {
    document.removeEventListener("mousemove", handleMouseMove);

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  function handleMouseMove(event: MouseEvent) {
    if (document.body.clientWidth <= 992) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      return;
    }

    animationFrameId = requestAnimationFrame(() => {
      setBackgroundPosition(AnimationHelper.movePositionOnMouseMove(event, 20));
    });
  }

  return (
    <div class={mergeCls("relative size-full overflow-hidden", props.class)}>
      <Image
        src={BackgroundPart2.src}
        loading="eager"
        fetchpriority="high"
        decoding="async"
        alt="Background part 2"
        sources={[
          { media: "(max-width: 720px)", srcset: BackgroundPart2Small.src },
          { media: "(max-width: 1080px)", srcset: BackgroundPart2Medium.src },
          { media: "(min-width: 1081px)", srcset: BackgroundPart2.src },
        ]}
        class="absolute -z-50 size-full object-cover object-center"
        style={{
          transform: `translate(${backgroundPosition()?.left ?? 0}px, ${backgroundPosition()?.top ?? 0}px) scale(1.02)`,
        }}
      />
      <Image
        src={BackgroundPart1.src}
        loading="eager"
        fetchpriority="high"
        decoding="async"
        alt="Background part 1"
        class="absolute top-96 -z-40 size-full object-cover object-top"
        sources={[
          { media: "(max-width: 720px)", srcset: BackgroundPart1Small.src },
          { media: "(max-width: 1080px)", srcset: BackgroundPart1Medium.src },
          { media: "(min-width: 1081px)", srcset: BackgroundPart1.src },
        ]}
      />
    </div>
  );
}
