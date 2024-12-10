import AnimationHelper from "~/core/acore-ts/ui/animation/AnimationHelper";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import DesktopImages from "../constants/Images";
import ImageScaleVariants from "~/presentation/src/shared/models/ImageScaleVariants";

type Props = {
  class?: string;
};

export default function Wallpaper(props: Props) {
  const [style, setStyle] = createSignal({ backgroundPosition: "top" });
  const [selectedImageVariant, setSelectedImageVariant] = createSignal<ImageScaleVariants | undefined>();
  let animationFrameId: number | null = null;

  onMount(() => {
    addEventListeners();
    selectBackgroundImage();

    onCleanup(removeEventListeners);
  });

  function addEventListeners() {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", selectBackgroundImage);
  }

  function removeEventListeners() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", selectBackgroundImage);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }

  function handleMouseMove(event: MouseEvent) {
    if (document.body.clientWidth <= 992) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      return;
    }

    animationFrameId = requestAnimationFrame(() => {
      setStyle({ backgroundPosition: AnimationHelper.moveBackgroundPositionOnMouseMove(event, 20) });
      onCleanup(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      });
    });
  }

  function selectBackgroundImage() {
    const screenWidth = window.innerWidth;
    setSelectedImageVariant(
      screenWidth <= 720
        ? ImageScaleVariants.small
        : screenWidth <= 1920
          ? ImageScaleVariants.medium
          : ImageScaleVariants.large,
    );
  }

  function getBackgroundImage(part: 1 | 2) {
    const variant = selectedImageVariant();
    if (variant === undefined) return undefined;
    return DesktopImages[`ahmet_cetinkaya_code_space_wallpaper_part_${part}_${variant}`];
  }

  return (
    <Show when={selectedImageVariant() !== undefined}>
      <div class={mergeCls("relative size-full overflow-hidden", props.class)}>
        <span
          class="absolute -z-50 size-full bg-cover bg-right-top bg-repeat"
          style={{
            "background-image": `url('${getBackgroundImage(2)}')`,
            "background-position": style().backgroundPosition,
          }}
        />
        <div class="mt-96">
          <span
            class="absolute -z-40 size-full bg-cover bg-bottom bg-no-repeat"
            style={{
              "background-image": `url('${getBackgroundImage(1)}')`,
            }}
          />
        </div>
      </div>
    </Show>
  );
}
