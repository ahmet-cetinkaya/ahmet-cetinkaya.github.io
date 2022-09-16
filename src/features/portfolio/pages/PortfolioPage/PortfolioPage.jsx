import './PortfolioPage.scss';

import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import GithubPortfolio from '../../components/GithubPortfolio/GithubPortfolio';
import SilhouetteTitle from '../../../../shared/components/SilhouetteTitle/SilhouetteTitle';
import locales from '../../../../shared/constants/localesKeys';
import GithubApiAdapter from '../../../../core/services/githubApiAdapter';

const aboutData = require('../../../../shared/assets/data/about.json');
const portfolioData = require('../../../../shared/assets/data/portfolio.json');

function PortfolioPage() {
  const { t } = useI18next();

  const github = {
    personal: {
      userName: aboutData.links.github.userName,
      userType: GithubApiAdapter.userTypes.user,
    },
    forks: {
      userName: aboutData.links.githubForks.userName,
      userType: GithubApiAdapter.userTypes.organization,
    },
  };

  return (
    <>
      <SilhouetteTitle title={t(locales.index.portfolio)} />

      <GithubPortfolio
        personal={github.personal}
        forks={github.forks}
        options={{ ignoreUrls: portfolioData.ignoreRepoUrls }}
      />
    </>
  );
}

PortfolioPage.propTypes = {};

PortfolioPage.defaultProps = {};

export default PortfolioPage;
