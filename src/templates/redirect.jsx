import * as React from 'react';

import Seo from '../core/components/Seo/Seo';
import { graphql } from 'gatsby';

function Redirect() {
  return <></>;
}

export function Head({ data, pageContext: { redirectTo } }) {
  // todo: use instead usei18next (https://github.com/microapps/gatsby-plugin-react-i18next/issues/150)
  const locales = JSON.parse(
    data.locales.edges.find((edge) => edge.node.ns === 'redirect').node.data
  );
  return (
    <>
      <Seo
        title={`${locales.redirecting}...`}
        description={`${locales.redirecting}: ${data.redirectTo}`}
      />
      <meta http-equiv="refresh" content={`0;URL=${redirectTo}`} />
    </>
  );
}

export default Redirect;

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
  }
`;
