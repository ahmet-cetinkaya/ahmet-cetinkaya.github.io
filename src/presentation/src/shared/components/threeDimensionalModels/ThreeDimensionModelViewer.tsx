import { createSignal, onCleanup, Show } from "solid-js";
import { AmbientLight, Camera, OrthographicCamera, Scene, SRGBColorSpace, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Icons } from "~/domain/data/Icons";
import Icon from "../Icon";

interface Props {
  modelPath: string;
  modelScale: number;
  configureScene?: (scene: Scene) => void;
  configureCamera?: (camera: OrthographicCamera) => void;
  configureControls?: (controls: OrbitControls) => void;
  class?: string;
}

export default function ThreeDimensionModelViewer(props: Props) {
  let containerRef: HTMLDivElement;
  const [isLoading, setIsLoading] = createSignal(true);
  let renderer: WebGLRenderer | undefined;
  let camera: OrthographicCamera | undefined;
  let scene: Scene | undefined;
  let controls: OrbitControls | undefined;
  let loader: GLTFLoader | undefined;
  const [renderElement, setRenderElement] = createSignal<HTMLCanvasElement>();

  function onContainerElementMount(element: HTMLDivElement) {
    containerRef = element;

    window.addEventListener("resize", onWindowResized);
    requestAnimationFrame(() => {
      initThree();
      loadModel();
      animate();
    });
  }

  onCleanup(() => {
    window.removeEventListener("resize", onWindowResized);
    if (controls) {
      controls.dispose();
    }
    if (renderer && containerRef) {
      containerRef.removeChild(renderer.domElement);
    }
  });

  function initThree() {
    if (!containerRef) throw new Error("Container element is not mounted yet.");
    const { clientWidth: width, clientHeight: height } = containerRef;

    // Renderer
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputColorSpace = SRGBColorSpace;

    // Scene
    scene = new Scene();

    // Camera
    const scale = height * 0.005 + 4.8;
    const aspect = width / height;
    camera = new OrthographicCamera(-scale * aspect, scale * aspect, scale, -scale, 0.01, 50000);
    const target = new Vector3(-0.5, -1, 0);
    if (props.configureCamera) props.configureCamera(camera);
    else {
      camera.position.set(20 * Math.sin(0.2 * Math.PI), 10, 50 * Math.cos(0.2 * Math.PI));
      camera.lookAt(target);
    }

    if (props.configureScene) props.configureScene(scene);
    else {
      // Lights
      const ambientLight = new AmbientLight("#fff", 1.2);
      scene.add(ambientLight);
    }

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);

    if (props.configureControls) props.configureControls(controls);
    else {
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      controls.maxPolarAngle = Math.PI / 2;
      controls.minZoom = 0.4;
      controls.maxZoom = 5;
      controls.target = target;
    }

    // Loader
    loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    const decoderPath = "/scripts/three/draco/gltf/";
    dracoLoader.setDecoderPath(decoderPath);
    loader.setDRACOLoader(dracoLoader);
    setRenderElement(renderer.domElement);
  }

  function loadModel() {
    loader?.load(
      props.modelPath,
      (gltf: GLTF) => {
        gltf.scene.position.y = 0;
        gltf.scene.position.x = 0;
        gltf.scene.receiveShadow = true;
        gltf.scene.castShadow = true;
        gltf.scene.scale.set(props.modelScale, props.modelScale, props.modelScale);
        scene?.add(gltf.scene);
        setIsLoading(false);
      },
      undefined,
      (error: unknown) => {
        setIsLoading(false);
        throw new Error(error as string);
      },
    );
  }

  function onWindowResized() {
    if (!containerRef || !renderer || !camera) return;

    const { clientWidth: width, clientHeight: height } = containerRef;
    const scale = height * 0.005 + 4.8;
    const aspect = width / height;
    camera.left = -scale * aspect;
    camera.right = scale * aspect;
    camera.top = scale;
    camera.bottom = -scale;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    if (!isLoading() && controls && scene && renderer) {
      controls.update();
      renderer.render(scene, camera as Camera);
    }
    requestAnimationFrame(animate);
  }

  return (
    <div ref={(element) => onContainerElementMount(element)} class={props.class ?? "size-full"}>
      <Show when={isLoading()}>
        <span class="flex size-full items-center justify-center">
          <Icon icon={Icons.spinner} isSpin />
        </span>
      </Show>

      <Show when={renderElement()}>{renderElement()}</Show>
    </div>
  );
}
