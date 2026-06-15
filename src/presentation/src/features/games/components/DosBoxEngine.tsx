import { onCleanup } from "solid-js";
import JSDosWrapper from "@packages/acore-ts/jsdos/JSDosWrapper";
import { Apps } from "@domain/data/Apps";
import { Paths } from "@domain/data/Directories";

type Props = {
  appId: Apps;
};

let activeDos: JSDosWrapper | undefined;

export default function DosBoxEngine(props: Props) {
  let dos: JSDosWrapper;
  let initialized = false;

  async function onContainerMount(element: HTMLDivElement) {
    if (initialized) return;
    initialized = true;

    if (activeDos) {
      await activeDos.dispose();
    }

    dos = new JSDosWrapper(element, {
      url: getAppImagePath(),
      autoStart: true,
      volume: 0.3,
    });
    activeDos = dos;
  }

  onCleanup(() => {
    dos?.dispose().catch(() => {});
    if (activeDos === dos) activeDos = undefined;
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

        .jsdos-rso .emulator-button-touch-zone {
          border: none;
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}
