import { Scene, DirectionalLight } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TranslationKeys } from "@domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "@packages/acore-solidjs/ui/components/ThreeDimensionModelViewer";
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

const MODEL = ModelPaths.DOOM;

export default function Doom3DModel(props: Props) {
  const config = props.config || DefaultConfigs.full;

  function configureScene(scene: Scene) {
    const directionalLight = new DirectionalLight("#ffffff", 6);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight("#ffffff", 6);
    directionalLight2.position.set(0, -10, -10);
    scene.add(directionalLight2);
  }

  function configureControlsLocal(controls: OrbitControls) {
    applyControls(controls, config);
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={0.8}
      configureScene={configureScene}
      configureControls={configureControlsLocal}
      autoRotate={config.animation?.enableAutoRotate}
      enableInitialAnimation={config.animation?.enableInitialAnimation}
      initializationDelay={config.animation?.initializationDelay}
      minHorizontalScale={config.minHorizontalScale ?? 7}
      class={props.class}
      loadingElement={
        <LoadingModelPreview src={ThumbnailPaths.DOOM} alt={TranslationKeys.apps_doom} class="h-[100%] w-[100%]" />
      }
    />
  );
}
