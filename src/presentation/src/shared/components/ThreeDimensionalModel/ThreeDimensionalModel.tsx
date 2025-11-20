import Icons from "@domain/data/Icons";
import Envelope3DModel from "./Envelope3DModel";
import Computer3DModel from "./Computer3DModel";
import Terminal3DModel from "./Terminal3DModel";
import Doom3DModel from "./Doom3DModel";
import { Show } from "solid-js";

type Props = {
  model: Icons;
  class?: string;
};

const MODEL_CLASSES = "flex items-center justify-center";

export default function ThreeDimensionalModel(props: Props) {
  return (
    <>
      <Show when={props.model === Icons.computer}>
        <Computer3DModel class={MODEL_CLASSES} />
      </Show>
      <Show when={props.model === Icons.envelope}>
        <Envelope3DModel class={MODEL_CLASSES} />
      </Show>
      <Show when={props.model === Icons.terminal}>
        <Terminal3DModel class={MODEL_CLASSES} />
      </Show>
      <Show when={props.model === Icons.doom}>
        <Doom3DModel class={MODEL_CLASSES} />
      </Show>
    </>
  );
}