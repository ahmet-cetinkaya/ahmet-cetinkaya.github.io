import './AboutPage.scss';

import React from 'react';
import {useI18next} from 'gatsby-plugin-react-i18next';
import SilhouetteTitle from '../../../../shared/components/SilhouetteTitle/SilhouetteTitle';
import SocialLinks from '../../../../shared/components/SocialLinks/SocialLinks';
import PersonalInfo from '../../components/PersonalInfo/PersonalInfo';
import TechnologiesInfo from '../../components/TechnologiesInfo/TechnologiesInfo';
import Testimonials from '../../components/Testimonials/Testimonials';

function AboutPage() {
  const {t} = useI18next();

  return (
    <>
      <SilhouetteTitle title={t('aboutMe')} />

      <div className="row">
        <div className="col-xxl-8 px-5">
          <p>{t('bio')}</p>
          <span className="d-flex justify-content-center mt-2">
            <SocialLinks />
          </span>
        </div>
        <div className="col-xxl-4 mt-3 mt-xxl-0">
          <PersonalInfo />
        </div>
      </div>

      <TechnologiesInfo />

      <Testimonials />
    </>
  );
}

AboutPage.propTypes = {};

AboutPage.defaultProps = {};

export default AboutPage;
