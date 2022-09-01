import { graphql } from 'gatsby';
import * as React from 'react';
import { useEffect } from 'react';
import Seo from '../core/components/Seo/Seo';


function Redirect({pageContext : {redirectTo}}) {
  
  useEffect(()=>{
    window.location.href = redirectTo;
  },[])

  return <div/>;
}

export function Head({data}) {
  // todo: use instead usei18next (https://github.com/microapps/gatsby-plugin-react-i18next/issues/150)
  const locales = JSON.parse(
    data.locales.edges.find(edge => edge.node.ns === 'redirect').node.data
  );
  return (
    <Seo
      title={`${locales.redirecting}...`}
      description={`${locales.redirecting}: ${data.redirectTo}`}
    />
  );
}

export default Redirect;

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
  }
`;
