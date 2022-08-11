import * as React from 'react';
import {Link, graphql} from 'gatsby';

import Bio from '../shared/components/Bio/Bio';
import Layout from '../shared/layouts/layout';
import Seo from '../core/components/Seo/Seo';
import {getPostUrl} from '../features/blog/utils/postHelper';

function BlogPostTemplate({
  data: {previous, next, site, markdownRemark: post},
  location,
}) {
  const siteTitle = site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{__html: post.html}}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={getPostUrl(previous)} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={getPostUrl(next)} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
}

export function Head({data: {markdownRemark: post}}) {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: {eq: $id}) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: {eq: $previousPostId}) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: {eq: $nextPostId}) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
