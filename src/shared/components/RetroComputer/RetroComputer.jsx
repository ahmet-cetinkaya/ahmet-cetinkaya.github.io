import './RetroComputer.scss';

import {
  AmbientLight,
  OrthographicCamera,
  PointLight,
  SRGBColorSpace,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { easeOutCirc } from '../../../core/utils/animation/easingHelper';
import { loadGLTFModel } from '../../../core/utils/three/modelHelpers';
import locales from '../../constants/localesKeys';
import { useI18next } from 'gatsby-plugin-react-i18next';

function RetroComputer() {
  const containerRef = useRef();
  const [loading, setLoading] = useState(true);
  const { t } = useI18next();
  const [renderer, setRenderer] = useState();
  // eslint-disable-next-line no-unused-vars
  const [camera, setCamera] = useState();
  const [target] = useState(new Vector3(-0.5, -1, 0));
  const [initialCameraPosition] = useState(
    new Vector3(20 * Math.sin(0.2 * Math.PI), 10, 50 * Math.cos(0.2 * Math.PI))
  );
  const [scene] = useState(new Scene());
  // eslint-disable-next-line no-unused-vars
  const [controls, setControls] = useState();

  // eslint-disable-next-line no-unused-vars
  let animationReq = null;

  const handleWindowResize = useCallback(() => {
    const { current: container } = containerRef;
    if (!container || !renderer) return;

    const scW = container.clientWidth;
    const scH = container.clientHeight;
    renderer.setSize(scW, scH);
  }, [renderer]);
  const create3dScene = async () => {
    const { current: container } = containerRef;
    if (container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;

      const newRenderer = new WebGLRenderer({ antialias: true, alpha: true });
      newRenderer.setPixelRatio(window.devicePixelRatio);
      newRenderer.setSize(scW, scH);
      newRenderer.outputColorSpace = SRGBColorSpace;
      container.appendChild(newRenderer.domElement);
      setRenderer(newRenderer);

      const scale = scH * 0.005 + 4.8;
      const newCamera = new OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        0.01,
        50000
      );
      newCamera.position.copy(initialCameraPosition);
      newCamera.lookAt(target);
      setCamera(newCamera);

      const ambientLight = new AmbientLight("#fff", 1.2);
      scene.add(ambientLight);

      const pointLight = new PointLight("#965eff", 160);
      pointLight.position.set(0.25, 0.5, 5);
      pointLight.distance = 4.8;
      scene.add(pointLight);

      const newControls = new OrbitControls(newCamera, newRenderer.domElement);
      newControls.autoRotate = true;
      newControls.enablePan = false;
      newControls.minZoom = 0.4;
      newControls.maxZoom = 5;
      newControls.target = target;
      setControls(newControls);

      await loadGLTFModel(
        scene,
        '/assets/models/retro-computer-draco-optimized.gltf',
        'retro-computer',
        { scale: 16.55, receiveShadow: false, castShadow: false }
      );

      setLoading(false);

      let frame = 0;
      const animate = () => {
        animationReq = requestAnimationFrame(animate);
        frame = frame <= 100 ? frame + 1 : frame;
        if (frame <= 100) {
          const rotateSpeed = -easeOutCirc(frame / 120) * Math.PI * 19.8;

          newCamera.position.y = 10;
          newCamera.position.x =
            initialCameraPosition.x * Math.cos(rotateSpeed) +
            initialCameraPosition.z * Math.sin(rotateSpeed);
          newCamera.position.z =
            initialCameraPosition.z * Math.cos(rotateSpeed) -
            initialCameraPosition.x * Math.sin(rotateSpeed);
          newCamera.lookAt(target);
        } else {
          newControls.update();
        }

        newRenderer.render(scene, newCamera);
      };
      animate();
    }
  };

  const dispose3dScene = () => {
    if (!renderer) return;
    cancelAnimationFrame(animationReq);
    renderer.dispose();
  };

  useEffect(() => {
    create3dScene();
  }, []);

  useEffect(
    () => () => {
      dispose3dScene();
    },
    [renderer]
  );

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false);

    return () => {
      window.removeEventListener('resize', handleWindowResize, false);
    };
  }, [renderer, handleWindowResize]);

  return (
    <div ref={containerRef} className="ac-retro-computer-container">
      {loading && (
        <div className="ac-loading">
          <div className="spinner-grow text-light" role="status">
            <span className="visually-hidden">
              {t(locales.index.loading)}...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

RetroComputer.propTypes = {};

RetroComputer.defaultProps = {};

export default RetroComputer;
