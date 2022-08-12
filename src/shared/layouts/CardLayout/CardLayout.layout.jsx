import './CardLayout.layout.scss';

import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {tiltElementOnMouseMove} from '../../../core/utils/animation/animationHelper';
import CodeSpaceBackground from '../../components/CodeSpaceBackground/CodeSpaceBackground';
import {
  createAddCardClassAction,
  createRemoveCardClassAction,
  createResetCardStateAction,
  createSetCardStyleAction,
} from '../../store/card/card.actions';

function CardLayout({location, children}) {
  const storeDispatch = useDispatch();
  const {classes, style} = useSelector(state => state.cardReducer);

  let cardTransformTimeout = false;

  const setCardTransformTimeout = () => {
    cardTransformTimeout = true;
    setTimeout(() => {
      cardTransformTimeout = false;
    }, 40);
  };

  const resetCardTransformStyle = () =>
    storeDispatch(createResetCardStateAction(['style']));

  const setCardTransformStyle = event => {
    if (cardTransformTimeout) return;
    if (document && document.body.clientWidth <= 992) {
      resetCardTransformStyle();
      return;
    }

    setCardTransformTimeout();
    storeDispatch(
      createSetCardStyleAction({transform: tiltElementOnMouseMove(event, 4)})
    );
  };

  const setIsCardLayoutExtended = () => {
    // eslint-disable-next-line no-undef
    const rootPath = `${__PATH_PREFIX__}/`;
    const isRootPath = location.pathname === rootPath;
    const className = 'ac-card-layout-extended';
    if (!isRootPath) storeDispatch(createAddCardClassAction(className));
    else storeDispatch(createRemoveCardClassAction(className));
  };

  useEffect(() => {
    document.addEventListener('mousemove', setCardTransformStyle.bind(this));
    document.addEventListener('mouseleave', resetCardTransformStyle.bind(this));
    setIsCardLayoutExtended();
  }, []);

  useEffect(
    () => () => {
      document.removeEventListener(
        'mousemove',
        setCardTransformStyle.bind(this)
      );
      document.removeEventListener(
        'mouseleave',
        resetCardTransformStyle.bind(this)
      );
    },
    []
  );

  return (
    <>
      <CodeSpaceBackground />
      <div
        className={['ac-card-layout', 'container', 'card', ...classes].join(
          ' '
        )}
        style={style}
      >
        <main>{children}</main>
      </div>
    </>
  );
}

CardLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

CardLayout.defaultProps = {};

export default CardLayout;
