import Icons from "@domain/data/Icons";
import { lazy, Suspense } from "solid-js";
import type { Model3DConfig } from "./models";

// Lazy load each 3D model component separately
const Computer3DModel = lazy(() => import("./Computer3DModel"));
const Envelope3DModel = lazy(() => import("./Envelope3DModel"));
const Terminal3DModel = lazy(() => import("./Terminal3DModel"));
const Doom3DModel = lazy(() => import("./Doom3DModel"));
const Folder3DModel = lazy(() => import("./Folder3DModel"));

type Props = {
  model: Icons;
  class?: string;
  onError?: () => void;
  config?: Model3DConfig;
};

const MODEL_CLASSES = "flex items-center justify-center";

export default function ThreeDimensionalModel(props: Props) {
  const renderModel = () => {
    switch (props.model) {
      case Icons.computer:
        return <Computer3DModel class={MODEL_CLASSES} config={props.config} />;
      case Icons.envelope:
        return <Envelope3DModel class={MODEL_CLASSES} config={props.config} />;
      case Icons.terminal:
        return <Terminal3DModel class={MODEL_CLASSES} config={props.config} />;
      case Icons.doom:
        return <Doom3DModel class={MODEL_CLASSES} config={props.config} />;
      case Icons.folder:
        return <Folder3DModel class={MODEL_CLASSES} config={props.config} />;
      default:
        return <div class="h-full w-full animate-pulse rounded-lg bg-gray-200" />;
    }
  };

  return (
    <Suspense
      fallback={
        <div
          class={`flex h-full w-full animate-pulse items-center justify-center rounded-lg bg-gray-200 ${props.class || ""}`}
        />
      }
    >
      {renderModel()}
    </Suspense>
  );
}
