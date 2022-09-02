import * as React from 'react';
import { graphql } from 'gatsby';

import Seo from '../core/components/Seo/Seo';
import CardLayout from '../shared/layouts/CardLayout/CardLayout.layout';

function NotFoundPage({ data, location }) {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <CardLayout location={location} title={siteTitle}>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </CardLayout>
  );
}
export default NotFoundPage;

export function Head() {
  return <Seo title="404: Not Found" />;
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
