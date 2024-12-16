import { Scene, AmbientLight, PointLight } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { TranslationKeys } from "~/domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "./ThreeDimensionModelViewer";
import EnvelopeModelPreview from "./assets/images/envelope-model-preview.webp";

type Props = {
  class?: string;
};

const MODEL = "/models/envelope_compressed.glb";

export default function Envelope3DModel(props: Props) {
  function configureScene(scene: Scene) {
    // Lights
    const ambientLight = new AmbientLight("#fff", 1.3);
    scene.add(ambientLight);

    const pointLight = new PointLight("#fff", 50);
    pointLight.position.set(3, 0, -1.6);
    pointLight.distance = 10;
    scene.add(pointLight);

    const pointLight2 = new PointLight("#fff", 50);
    pointLight2.position.set(-2, 0, -1.4);
    pointLight2.distance = 10;
    scene.add(pointLight2);
  }

  function configureModel(gltf: GLTF) {
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.rotation.y = 10.5;
  }

  return (
    <ThreeDimensionModelViewer
      modelPath={MODEL}
      modelScale={7}
      configureScene={configureScene}
      configureModel={configureModel}
      class={props.class}
      loadingElement={<LoadingModelPreview src={EnvelopeModelPreview.src} alt={TranslationKeys.common_envelope} />}
    />
  );
}
