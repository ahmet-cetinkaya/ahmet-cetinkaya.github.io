import './PortfolioPage.scss';

import GithubApiAdapter from '../../../../core/services/githubApiAdapter';
import GithubPortfolio from '../../components/GithubPortfolio/GithubPortfolio';
import React from 'react';
import SilhouetteTitle from '../../../../shared/components/SilhouetteTitle/SilhouetteTitle';
import locales from '../../../../shared/constants/localesKeys';
import { useI18next } from 'gatsby-plugin-react-i18next';

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
    instruction: {
      userName: aboutData.links.githubInstruction.userName,
      userType: GithubApiAdapter.userTypes.organization,
    },
  };

  return (
    <>
      <SilhouetteTitle title={t(locales.index.portfolio)} />

      <GithubPortfolio
        personal={github.personal}
        forks={github.forks}
        instruction={github.instruction}
        options={{ ignoreUrls: portfolioData.ignoreRepoUrls }}
      />
    </>
  );
}

PortfolioPage.propTypes = {};

PortfolioPage.defaultProps = {};

export default PortfolioPage;
