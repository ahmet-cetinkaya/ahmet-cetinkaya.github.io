import * as React from 'react';
import { graphql } from 'gatsby';

import Seo from '../core/components/Seo/Seo';
import CardLayout from '../shared/layouts/CardLayout/CardLayout.layout';
import AboutPage from '../features/about/pages/AboutPage/AboutPage';

function About({ location }) {
  return (
    <CardLayout location={location}>
      <AboutPage />
    </CardLayout>
  );
}
export default About;

export function Head({ data }) {
  // todo: use instead usei18next (https://github.com/microapps/gatsby-plugin-react-i18next/issues/150)
  const locales = JSON.parse(
    data.locales.edges.find((edge) => edge.node.ns === 'index').node.data
  );
  return <Seo title={locales.aboutMe} />;
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
      }
    }
  }
`;
