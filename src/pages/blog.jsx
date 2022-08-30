import * as React from 'react';
import {Link, graphql} from 'gatsby';

import Seo from '../core/components/Seo/Seo';
import {getPostUrl} from '../features/blog/utils/postHelper';
import CardLayout from '../shared/layouts/CardLayout/CardLayout.layout';

function BlogIndex({data, location}) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <CardLayout location={location}>
      <ol style={{listStyle: `none`}}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug;

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={getPostUrl(post)} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          );
        })}
      </ol>
    </CardLayout>
  );
}
export default BlogIndex;

export function Head() {
  return <Seo title="All posts" />;
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
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`;
