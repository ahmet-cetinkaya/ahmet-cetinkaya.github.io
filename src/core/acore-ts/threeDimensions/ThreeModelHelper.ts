import { Mesh, Object3D, Scene } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface LoadGLTFModelOptions {
  scale?: number;
  receiveShadow?: boolean;
  castShadow?: boolean;
}

export default class ThreeModelHelper {
  static async loadGLTFModel(
    scene: Scene,
    glbPath: string,
    objectName: string,
    { scale = 1, receiveShadow = true, castShadow = true }: LoadGLTFModelOptions = {},
  ): Promise<Object3D> {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/scripts/three/draco/gltf/");
    dracoLoader.setDecoderConfig({ type: "js" });
    await dracoLoader.preload();

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const gltf = await gltfLoader.loadAsync(glbPath);

    const object = gltf.scene;
    object.name = objectName;
    object.position.y = 0;
    object.position.x = 0;
    object.receiveShadow = receiveShadow;
    object.castShadow = castShadow;
    object.scale.set(scale, scale, scale);
    scene.add(object);

    object.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.receiveShadow = receiveShadow;
        child.castShadow = castShadow;
      }
    });

    return object;
  }
}
