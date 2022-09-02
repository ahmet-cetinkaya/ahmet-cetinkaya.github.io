import './CodeSpaceBackground.scss';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSetBackgroundStyleAction } from '../../store/background/background.actions';
import { moveBackgroundPositionOnMouseMove } from '../../../core/utils/animation/animationHelper';

function CodeSpaceBackground() {
  const { style } = useSelector((state) => state.backgroundReducer);
  const storeDispatch = useDispatch();

  let backgroundPositionTimeout = false;

  const setBackgroundPositionTimeout = () => {
    backgroundPositionTimeout = true;
    setTimeout(() => {
      backgroundPositionTimeout = false;
    }, 40);
  };

  const setBackgroundPosition = (event) => {
    if (backgroundPositionTimeout) return;
    if (document.body.clientWidth <= 992) return;

    setBackgroundPositionTimeout();
    storeDispatch(
      createSetBackgroundStyleAction({
        backgroundPosition: moveBackgroundPositionOnMouseMove(event, 20),
      })
    );
  };

  useEffect(
    () =>
      window.addEventListener('mousemove', setBackgroundPosition.bind(this)),
    []
  );

  useEffect(
    () => () =>
      window.removeEventListener('mousemove', setBackgroundPosition.bind(this)),
    []
  );

  return (
    <>
      <div className="ac-bg" />
      <div className="ac-bg-back" style={style} />
    </>
  );
}

CodeSpaceBackground.propTypes = {};

CodeSpaceBackground.defaultProps = {};

export default CodeSpaceBackground;
