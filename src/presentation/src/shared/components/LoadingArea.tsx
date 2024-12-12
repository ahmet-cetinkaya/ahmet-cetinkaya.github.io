import { onCleanup, onMount } from "solid-js";
import Icon from "./Icon";
import Icons from "~/domain/data/Icons";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

type Props = {
  class?: string;
};

export default function LoadingArea(props: Props) {
  onMount(() => {
    setProgressCursor();
  });

  function setProgressCursor() {
    document.body.classList.add("cursor-progress");

    onCleanup(() => {
      document.body.classList.remove("cursor-progress");
    });
  }

  return (
    <div
      ref={setProgressCursor}
      class={mergeCls(
        "flex size-full animate-ping cursor-progress items-center justify-center overflow-hidden",
        props.class,
      )}
    >
      <Icon icon={Icons.spinner} isSpin class="size-12" />
    </div>
  );
}
