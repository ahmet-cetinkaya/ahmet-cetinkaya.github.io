import './ProfileTitles.scss';

import React from 'react';

function ProfileTitles() {
  return (
    <div className="carousel slide ac-vertical" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="3000">
          <h6 className="ac-text-color-3 fw-light">Computer Engineer</h6>
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <h6 className="ac-text-color-3 fw-light">Software Developer</h6>
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <h6 className="ac-text-color-3 fw-light">Full Stack Web Developer</h6>
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <h6 className="ac-text-color-3 fw-light">Game Developer</h6>
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <h6 className="ac-text-color-3 fw-light">Instructor</h6>
        </div>
        <div className="carousel-item" data-bs-interval="3000">
          <h6 className="ac-text-color-3 fw-light">Learner</h6>
        </div>
      </div>
    </div>
  );
}

ProfileTitles.propTypes = {};

ProfileTitles.defaultProps = {};

export default ProfileTitles;
