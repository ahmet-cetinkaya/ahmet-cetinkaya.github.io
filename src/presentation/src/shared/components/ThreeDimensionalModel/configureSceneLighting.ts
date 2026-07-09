import { AmbientLight, DirectionalLight, type Scene } from "three";

type DirectionalLightOptions = {
  intensity: number;
  position?: { x: number; y: number; z: number };
};

export function configureSceneLighting(scene: Scene, directionalLight: DirectionalLightOptions): void {
  const ambient = new AmbientLight("#fff", 1);
  scene.add(ambient);

  const directional = new DirectionalLight("#fff", directionalLight.intensity);
  if (directionalLight.position) {
    directional.position.set(directionalLight.position.x, directionalLight.position.y, directionalLight.position.z);
  }
  scene.add(directional);
}
