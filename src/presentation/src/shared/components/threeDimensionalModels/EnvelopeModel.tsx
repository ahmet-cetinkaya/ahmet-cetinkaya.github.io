import { AmbientLight, PointLight, Scene } from "three";
import ThreeDimensionModelViewer from "./ThreeDimensionModelViewer";
import type { GLTF } from "three/examples/jsm/Addons.js";

type Props = {
  class?: string;
};

export default function EnvelopeModel(props: Props) {
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
    gltf.scene.rotation.y = 10.5; // Set initial orientation
  }

  return (
    <ThreeDimensionModelViewer
      modelPath="/models/envelope_compressed.glb"
      modelScale={7}
      configureScene={configureScene}
      configureModel={configureModel}
      class={props.class}
    />
  );
}
