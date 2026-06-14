import { AmbientLight, DirectionalLight, type Scene } from "three";
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

const MODEL = ModelPaths.FOLDER;

export default function Folder3DModel(props: Props) {
  const config = props.config || DefaultConfigs.full;

  function configureScene(scene: Scene) {
    const ambientLight = new AmbientLight("#fff", 1);
    scene.add(ambientLight);

    const pointLight = new DirectionalLight("#fff", 5);
    pointLight.position.x = 5;
    pointLight.position.y = 10;
    pointLight.position.x = 3;

    scene.add(pointLight);
  }

  function configureControlsLocal(controls: OrbitControls) {
    applyControls(controls, config);
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      minHorizontalScale={config.minHorizontalScale ?? 7}
      configureScene={configureScene}
      configureControls={configureControlsLocal}
      autoRotate={config.animation?.enableAutoRotate}
      enableInitialAnimation={config.animation?.enableInitialAnimation}
      initializationDelay={config.animation?.initializationDelay}
      class={props.class}
      loadingElement={
        <LoadingModelPreview src={ThumbnailPaths.FOLDER} alt={TranslationKeys.apps_file_explorer} class="size-[100%]" />
      }
    />
  );
}
