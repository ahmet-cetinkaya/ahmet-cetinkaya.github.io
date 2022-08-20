import * as React from 'react';
import {graphql} from 'gatsby';

import Seo from '../core/components/Seo/Seo';
import CardLayout from '../shared/layouts/CardLayout/CardLayout.layout';
import HomePage from '../features/home/pages/HomePage/HomePage';

function Index({location}) {
  return (
    <CardLayout location={location}>
      <HomePage />
    </CardLayout>
  );
}
export default Index;

export function Head() {
  return <Seo title="Hi" />;
}

export const pageQuery = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
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
