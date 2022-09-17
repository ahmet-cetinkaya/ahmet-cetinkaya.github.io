import './RetroComputer.scss';

import React, { useCallback, useState } from 'react';
import { useRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import locales from '../../../shared/constants/localesKeys';
import {
  AmbientLight,
  OrthographicCamera,
  PointLight,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';
import { loadGLTFModel } from '../../../core/utils/three/modelHelpers';
import { easeOutCirc } from '../../../core/utils/animation/easingHelper';

function RetroComputer() {
  const containerRef = useRef();
  const [loading, setLoading] = useState(true);
  const { t } = useI18next();
  const [renderer, setRenderer] = useState();
  const [camera, setCamera] = useState();
  const [target] = useState(new Vector3(-0.5, -1, 0));
  const [initialCameraPosition] = useState(
    new Vector3(20 * Math.sin(0.2 * Math.PI), 10, 50 * Math.cos(0.2 * Math.PI))
  );
  const [scene] = useState(new Scene());
  const [controls, setControls] = useState();

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

      const renderer = new WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = sRGBEncoding;
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const scale = scH * 0.005 + 4.8;
      const camera = new OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        0.01,
        50000
      );
      camera.position.copy(initialCameraPosition);
      camera.lookAt(target);
      setCamera(camera);

      const ambientLight = new AmbientLight(0x343434, 2);
      scene.add(ambientLight);

      const pointLight = new PointLight(0x4b15e0, 8);
      pointLight.position.set(0.25, 0.5, 5);
      pointLight.distance = 4.8;
      scene.add(pointLight);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.target = target;
      setControls(controls);

      await loadGLTFModel(
        scene,
        'assets/models/retro-computer.glb',
        'retro-computer',
        { scale: 22, receiveShadow: false, castShadow: false }
      );

      setLoading(false);

      let req = null;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);
        frame = frame <= 100 ? frame + 1 : frame;
        if (frame <= 100) {
          const rotateSpeed = -easeOutCirc(frame / 120) * Math.PI * 19.8;

          camera.position.y = 10;
          camera.position.x =
            initialCameraPosition.x * Math.cos(rotateSpeed) +
            initialCameraPosition.z * Math.sin(rotateSpeed);
          camera.position.z =
            initialCameraPosition.z * Math.cos(rotateSpeed) -
            initialCameraPosition.x * Math.sin(rotateSpeed);
          camera.lookAt(target);
        } else {
          controls.update();
        }

        renderer.render(scene, camera);
      };
      animate();
    }
  };

  const dispose3dScene = () => {
    cancelAnimationFrame(req);
    renderer.dispose();
  };

  useEffect(() => {
    create3dScene();

    () => {
      dispose3dScene();
    };
  }, []);

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
