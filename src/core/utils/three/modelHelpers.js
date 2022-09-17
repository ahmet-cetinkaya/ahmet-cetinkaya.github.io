/* eslint-disable import/prefer-default-export */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export async function loadGLTFModel(
  scene,
  glbPath,
  objectName,
  { scale = 1, receiveShadow = true, castShadow = true } = {}
) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(glbPath);

  const object = gltf.scene;
  object.name = objectName;
  object.position.y = 0;
  object.position.x = 0;
  object.receiveShadow = receiveShadow;
  object.castShadow = castShadow;
  object.scale.set(scale, scale, scale); // todo: scale should be a parameter
  scene.add(object);

  object.traverse((child) => {
    if (child.isMesh) {
      // eslint-disable-next-line no-param-reassign
      child.receiveShadow = receiveShadow;
      // eslint-disable-next-line no-param-reassign
      child.castShadow = castShadow;
    }
  });

  return object;
}
