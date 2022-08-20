import './HomePage.scss';

import React from 'react';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import ProfileTitles from '../../components/ProfileTitles/ProfileTitles';
import SocialLinks from '../../../../shared/components/SocialLinks/SocialLinks';

function HomePage() {
  return (
    <div id="home" className="h-100 row">
      <div className="col-xl-5 d-flex justify-content-center align-items-center">
        <ProfileIcon />
      </div>
      <div className="col-xl-7 d-flex flex-column justify-content-center align-items-start">
        <ProfileTitles />
        <h1 className="ac-text-color fw-900 mb-4">Ahmet Çetinkaya</h1>
        <SocialLinks className="fs-3" />
      </div>
    </div>
  );
}

HomePage.propTypes = {};

HomePage.defaultProps = {};

export default HomePage;
