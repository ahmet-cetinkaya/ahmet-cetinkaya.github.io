/* eslint-disable no-undef */
import './CardLayout.layout.scss';

import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import classNames from 'classnames';
import {useI18next} from 'gatsby-plugin-react-i18next';
import {tiltElementOnMouseMove} from '../../../core/utils/animation/animationHelper';
import CodeSpaceBackground from '../../components/CodeSpaceBackground/CodeSpaceBackground';
import {
  createAddCardClassAction,
  createRemoveCardClassAction,
  createResetCardStateAction,
  createSetCardStyleAction,
} from '../../store/card/card.actions';
import SideNavbar from '../SideNavbar/SideNavbar';
import ChangeLanguageButton from '../../../core/components/ChangeLanguageButton/ChangeLanguageButton';

function CardLayout({location, children}) {
  const storeDispatch = useDispatch();
  const {classes, style} = useSelector(state => state.cardReducer);
  const {languages} = useI18next();
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
    const isRootPath = [
      `${__PATH_PREFIX__}/`,
      ...languages.map(language => `${__PATH_PREFIX__}/${language}/`),
    ].includes(location.pathname);
    const extendedClassName = 'ac-card-layout-extended';
    if (!isRootPath) storeDispatch(createAddCardClassAction(extendedClassName));
    else storeDispatch(createRemoveCardClassAction(extendedClassName));
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
        className={classNames('ac-card-layout container card', classes)}
        style={style}
      >
        <SideNavbar />
        <ChangeLanguageButton className="ac-change-language-button" />
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
