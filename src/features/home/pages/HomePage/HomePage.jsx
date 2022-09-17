import './HomePage.scss';

import React from 'react';
import ProfileTitles from '../../components/ProfileTitles/ProfileTitles';
import SocialLinks from '../../../../shared/components/SocialLinks/SocialLinks';
import RetroComputer from '../../../../shared/components/RetroComputer/RetroComputer';
import HomeCredits from '../../components/HomeCredits/HomeCredits';

function HomePage() {
  return (
    <div id="home" className="h-100 row">
      <div className="col-xl-5 d-flex justify-content-center align-items-center">
        <RetroComputer />
      </div>
      <div className="col-xl-7 d-flex flex-column justify-content-center align-items-start">
        <ProfileTitles />
        <h1 className="ac-text-color fw-900 mb-4">Ahmet Çetinkaya</h1>
        <SocialLinks className="fs-3" />
        <HomeCredits />
      </div>
    </div>
  );
}

HomePage.propTypes = {};

HomePage.defaultProps = {};

export default HomePage;
