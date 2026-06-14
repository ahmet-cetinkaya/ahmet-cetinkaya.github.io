import { AmbientLight, PointLight, type Scene } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ThreeDimensionModelViewer from "@packages/acore-solidjs/ui/components/ThreeDimensionModelViewer";
import LoadingModelPreview from "./Loading3DModelPreview";
import { TranslationKeys } from "@domain/data/Translations";
import { DRACO_DIRECTORY } from "./constants/draco";
import ModelPaths from "@shared/constants/ModelPaths";
import type { Model3DConfig } from "./models";
import { DefaultConfigs } from "./constants/defaultConfigs";
import ThumbnailPaths from "@shared/constants/ThumbnailPaths";
import { configureControls as applyControls } from "./configureControls";

type Props = {
  class?: string;
  config?: Model3DConfig;
};

const MODEL = ModelPaths.COMPUTER;

export default function Computer3DModel(props: Props) {
  const config = props.config || DefaultConfigs.full;

  function configureScene(scene: Scene) {
    const ambientLight = new AmbientLight("#fff", 1.5);
    scene.add(ambientLight);

    const pointLight = new PointLight("#965eff", 160);
    pointLight.position.set(0.25, 1, 5);
    pointLight.distance = 4.8;
    scene.add(pointLight);
  }

  function configureControlsLocal(controls: OrbitControls) {
    applyControls(controls, config);
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={1.5}
      minHorizontalScale={config.minHorizontalScale ?? 7}
      configureScene={configureScene}
      configureControls={configureControlsLocal}
      autoRotate={config.animation?.enableAutoRotate}
      enableInitialAnimation={config.animation?.enableInitialAnimation}
      initializationDelay={config.animation?.initializationDelay}
      class={props.class}
      loadingElement={
        <LoadingModelPreview src={ThumbnailPaths.COMPUTER} alt={TranslationKeys.common_computer} class="size-[100%]" />
      }
    />
  );
}
