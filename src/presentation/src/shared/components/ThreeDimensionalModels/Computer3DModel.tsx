import { AmbientLight, PointLight, type Scene } from "three";
import ThreeDimensionModelViewer from "./ThreeDimensionModelViewer";
import LoadingModelPreview from "./Loading3DModelPreview";
import { TranslationKeys } from "~/domain/data/Translations";
import ComputerModelPreview from "./assets/images/retro-computer-model-preview.webp";

type Props = {
  class?: string;
};

const MODEL = "/models/computer/retro-computer.glb";

export default function Computer3DModel(props: Props) {
  function configureScene(scene: Scene) {
    // Lights
    const ambientLight = new AmbientLight("#fff", 1.5);
    scene.add(ambientLight);

    const pointLight = new PointLight("#965eff", 160);
    pointLight.position.set(0.25, 0.5, 5);
    pointLight.distance = 4.8;
    scene.add(pointLight);
  }

  return (
    <ThreeDimensionModelViewer
      modelPath={MODEL}
      modelScale={16.55}
      configureScene={configureScene}
      class={props.class}
      loadingElement={<LoadingModelPreview src={ComputerModelPreview.src} alt={TranslationKeys.common_computer} />}
    />
  );
}
