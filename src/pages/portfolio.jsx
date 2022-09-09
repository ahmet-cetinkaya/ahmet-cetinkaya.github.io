import * as React from 'react';
import { graphql } from 'gatsby';

import Seo from '../core/components/Seo/Seo';
import CardLayout from '../shared/layouts/CardLayout/CardLayout.layout';
import PortfolioPage from '../features/portfolio/pages/PortfolioPage/PortfolioPage';
import GithubApiAdapter from '../core/services/githubApiAdapter';

function Portfolio({ data, location }) {
  const { github, githubForks } = data.site.siteMetadata.social;

  return (
    <CardLayout location={location}>
      <PortfolioPage
        github={{
          personal: {
            userName: github,
            userType: GithubApiAdapter.userTypes.user,
          },
          forks: {
            userName: githubForks,
            userType: GithubApiAdapter.userTypes.organization,
          },
        }}
      />
    </CardLayout>
  );
}
export default Portfolio;

export function Head({ data }) {
  // todo: use instead usei18next (https://github.com/microapps/gatsby-plugin-react-i18next/issues/150)
  const locales = JSON.parse(
    data.locales.edges.find((edge) => edge.node.ns === 'index').node.data
  );
  return <Seo title={locales.portfolio} />;
}

export const pageQuery = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    site {
      siteMetadata {
        title
        social {
          github
          githubForks
        }
      }
    }
  }
`;
