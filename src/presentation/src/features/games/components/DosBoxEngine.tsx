import { onCleanup } from "solid-js";
import JSDosWrapper from "~/core/acore-ts/jsdos/JSDosWrapper";
import { Apps } from "~/domain/data/Apps";
import { Paths } from "~/domain/data/Directories";

type Props = {
  appId: Apps;
};

export default function DosBoxEngine(props: Props) {
  let dos: JSDosWrapper;

  function onContainerMount(element: HTMLDivElement) {
    dos = new JSDosWrapper(element, {
      url: getAppImagePath(),
      autoStart: true,
      volume: 0.3,
    });
  }

  onCleanup(() => {
    dos.dispose()!;
    dos = null!;
  });

  function getAppImagePath() {
    switch (props.appId) {
      case Apps.doom:
        return `${Paths.USER_GAMES}/doom.jsdos`;
      default:
        throw new Error(`App not found: ${props.appId}`);
    }
  }

  return (
    <div id="dos" ref={onContainerMount} class="size-full">
      <style>{`
        .jsdos-rso .sidebar {
          display: none;
        }
      `}</style>
    </div>
  );
}
