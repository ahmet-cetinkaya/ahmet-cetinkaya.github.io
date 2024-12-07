import { AmbientLight, PointLight, Scene } from "three";
import ThreeDimensionModelViewer from "./ThreeDimensionModelViewer";

type Props = {
  class?: string;
};

export default function EnvelopeModel(props: Props) {
  function configureScene(scene: Scene) {
    // Lights
    const ambientLight = new AmbientLight("#fff", 1.3);
    scene.add(ambientLight);

    const pointLight = new PointLight("#fff", 50);
    pointLight.position.set(4, 0, 0);
    pointLight.distance = 20;
    scene.add(pointLight);

    const pointLight2 = new PointLight("#fff", 50);
    pointLight2.position.set(-4, 0, 0);
    pointLight2.distance = 20;
    scene.add(pointLight2);
  }

  return (
    <ThreeDimensionModelViewer
      modelPath="/models/envelope_compressed.glb"
      modelScale={7}
      configureScene={configureScene}
      class={props.class}
    />
  );
}
