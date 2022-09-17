import './ProfileIcon.scss';

import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';
import { moveBackgroundPositionOnMouseMove } from '../../../core/utils/animation/animationHelper';

function ProfileIcon() {
  const [style, setStyle] = useState({
    backgroundPosition: undefined,
    transition: 'none',
  });

  let profileIconMoveEffectTimeout = false;

  const timeoutProfileIconMoveEffect = () => {
    profileIconMoveEffectTimeout = true;
    setTimeout(() => {
      profileIconMoveEffectTimeout = false;
    }, 10);
  };

  const profileIconMoveEffect = (event) => {
    if (profileIconMoveEffectTimeout) return;
    timeoutProfileIconMoveEffect();
    setStyle({
      backgroundPosition: moveBackgroundPositionOnMouseMove(event),
      transition: 'none',
    });
  };

  const resetProfileIconMoveEffect = () => {
    setStyle({
      backgroundPosition: undefined,
      transition: 'all 180ms ease-in-out',
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', profileIconMoveEffect.bind(this));
    document.addEventListener(
      'mouseleave',
      resetProfileIconMoveEffect.bind(this)
    );
  }, []);

  useEffect(
    () => () => {
      document.removeEventListener(
        'mousemove',
        profileIconMoveEffect.bind(this)
      );
      document.removeEventListener(
        'mouseleave',
        resetProfileIconMoveEffect.bind(this)
      );
    },
    []
  );

  return (
    <Link to="/about" className="link-light text-decoration-none">
      <div className="ac-profile-frame shadow">
        <div className="ac-profile-image profile" style={style} />
      </div>
    </Link>
  );
}

ProfileIcon.propTypes = {};

ProfileIcon.defaultProps = {};

export default ProfileIcon;
