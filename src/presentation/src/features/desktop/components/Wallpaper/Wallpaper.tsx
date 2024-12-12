import { createSignal, onCleanup, onMount } from "solid-js";
import AnimationHelper from "~/core/acore-ts/ui/animation/AnimationHelper";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import Position from "~/core/acore-ts/ui/models/Position";
import Image from "~/presentation/src/shared/components/ui/Image";
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
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });

  function handleMouseMove(event: MouseEvent) {
    if (document.body.clientWidth <= 992) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      return;
    }

    animationFrameId = requestAnimationFrame(() => {
      setBackgroundPosition(AnimationHelper.movePositionOnMouseMove(event, 20));
    });
    onCleanup(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });
  }

  return (
    <div class={mergeCls("relative size-full overflow-hidden", props.class)}>
      <Image
        class="absolute -z-50 size-full object-cover object-center"
        src={BackgroundPart2.src}
        srcset={`${BackgroundPart2Small.src} 720w,
                 ${BackgroundPart2Medium.src} 1080w,
                 ${BackgroundPart2.src} 2000w`}
        sizes="(max-width: 720px) 720px,
               (max-width: 1080px) 1080px,
               2000px"
        width="720"
        height="auto"
        loading="lazy"
        decoding="async"
        alt="Background part 2"
        style={{
          transform: `translate(${backgroundPosition()?.left ?? 0}px, ${backgroundPosition()?.top ?? 0}px) scale(1.02)`,
        }}
      />
      <Image
        class="absolute top-96 -z-40 size-full object-cover object-top"
        src={BackgroundPart1.src}
        srcset={`${BackgroundPart1Small.src} 720w,
                 ${BackgroundPart1Medium.src} 1080w,
                 ${BackgroundPart1.src} 2000w`}
        sizes="(max-width: 720px) 720px,
               (max-width: 1080px) 1080px,
               2000px"
        width="720"
        height="auto"
        loading="lazy"
        decoding="async"
        alt="Background part 1"
      />
    </div>
  );
}
