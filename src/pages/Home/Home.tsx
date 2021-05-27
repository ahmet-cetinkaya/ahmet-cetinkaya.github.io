import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import SocialButtons from '../../components/SocialButtons/SocialButtons';

import moveBackgroundPositionOnMouseMove from '../../utils/moveBackgroundPositionOnMouseMove';
import './Home.scss';

class Home extends Component<WithTranslation> {
  _isMounted = false;

  state = {
    profileStyle: {
      backgroundPosition: undefined,
    },
  };

  componentDidMount(): void {
    this._isMounted = true;
    window.addEventListener('mousemove', this.setBackgroundPosition.bind(this));
  }

  componentWillUnmount(): void {
    this._isMounted = false;
    window.removeEventListener('mousemove', this.setBackgroundPosition.bind(this));
  }

  setBackgroundPosition(event: MouseEvent): void {
    if (this._isMounted)
      this.setState({
        profileStyle: {
          backgroundPosition: moveBackgroundPositionOnMouseMove(event),
        },
      });
  }

  render(): JSX.Element {
    const { profileStyle } = this.state,
      { t } = this.props;

    return (
      <div id='home' className='row'>
        <div className='col-5 d-flex justify-content-center align-items-center'>
          <div className='profile-frame shadow'>
            <div className='profile' style={profileStyle}></div>
          </div>
        </div>
        <div className='col-7 d-flex flex-column justify-content-center align-items-start'>
          <div id='titleCarousel' className='carousel slide vertical' data-bs-ride='carousel'>
            <div className='carousel-inner'>
              <div className='carousel-item active' data-bs-interval='3000'>
                <h6 className='text-color-3 fw-light'>Computer Engineer</h6>
              </div>
              <div className='carousel-item' data-bs-interval='2000'>
                <h6 className='text-color-3 fw-light'>Software Developer</h6>
              </div>
              <div className='carousel-item' data-bs-interval='2000'>
                <h6 className='text-color-3 fw-light'>Frontend Developer</h6>
              </div>
              <div className='carousel-item' data-bs-interval='2000'>
                <h6 className='text-color-3 fw-light'>Full Stack Developer</h6>
              </div>
              <div className='carousel-item' data-bs-interval='2000'>
                <h6 className='text-color-3 fw-light'>Lifetime Learner</h6>
              </div>
            </div>
          </div>

          <h1 className='text-color fw-bold'>Ahmet Çetinkaya</h1>
          <p className='text-color-2'>{t('short-bio')}</p>
          <SocialButtons className='fs-3' />
        </div>
      </div>
    );
  }
}

export default withTranslation()(Home);
