import './AboutPage.scss';

import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import SilhouetteTitle from '../../../../shared/components/SilhouetteTitle/SilhouetteTitle';
import SocialLinks from '../../../../shared/components/SocialLinks/SocialLinks';
import PersonalInfo from '../../components/PersonalInfo/PersonalInfo';
import TechnologiesInfo from '../../components/TechnologiesInfo/TechnologiesInfo';
import Testimonials from '../../components/Testimonials/Testimonials';
import locales from '../../../../shared/constants/localesKeys';

function AboutPage() {
  const { t } = useI18next();

  return (
    <>
      <SilhouetteTitle title={t(locales.index.aboutMe)} />

      <div className="row">
        <div className="col-xxl-8 px-xs-2 px-sm-5">
          <p>{t(locales.about.bio)}</p>
          <span className="d-flex justify-content-center mb-2">
            <SocialLinks />
          </span>
        </div>
        <div className="col-xxl-4 px-xs-2 px-sm-5 mt-3 mt-xxl-0">
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
