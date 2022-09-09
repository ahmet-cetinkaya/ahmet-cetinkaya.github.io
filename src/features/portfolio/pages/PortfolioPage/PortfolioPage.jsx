import './PortfolioPage.scss';

import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import PropTypes from 'prop-types';
import GithubPortfolio from '../../components/GithubPortfolio/GithubPortfolio';
import SilhouetteTitle from '../../../../shared/components/SilhouetteTitle/SilhouetteTitle';
import locales from '../../../../shared/constants/localesKeys';

function PortfolioPage({ github }) {
  const { t } = useI18next();

  return (
    <>
      <SilhouetteTitle title={t(locales.index.portfolio)} />

      <GithubPortfolio personal={github.personal} forks={github.forks} />
    </>
  );
}

PortfolioPage.propTypes = {
  github: PropTypes.shape({
    personal: PropTypes.shape({
      userName: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
    }).isRequired,
    forks: PropTypes.shape({
      userName: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

PortfolioPage.defaultProps = {};

export default PortfolioPage;
