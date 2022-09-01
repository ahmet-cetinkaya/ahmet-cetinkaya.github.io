const path = require(`path`);
const {createFilePath} = require(`gatsby-source-filesystem`);
const redirects = require('./src/shared/assets/data/redirects.json');

exports.createPages = async ({graphql, actions, reporter}) => {
  const {createPage} = actions;

  // Blog Post Pages
  const blogPost = path.resolve(`./src/templates/blog-post.jsx`);
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: {fields: [frontmatter___date], order: ASC}
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );
    return;
  }

  const posts = result.data.allMarkdownRemark.nodes;

  const languages = ['tr', 'en'];
  languages.forEach(language => {
    const postsByLanguage = posts.filter(post =>
      post.fields.slug.startsWith(`/${language}`)
    );

    postsByLanguage.forEach((post, index) => {
      const previousPostId = index === 0 ? null : postsByLanguage[index - 1].id;
      const nextPostId =
        index === postsByLanguage.length - 1
          ? null
          : postsByLanguage[index + 1].id;
      const postSlug = post.fields.slug.split('/').at(-2);

      createPage({
        path: `blog/${postSlug}`,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  });

  // Redirect Pages
  const redirectComponent = path.resolve(`./src/templates/redirect.jsx`);
  redirects.forEach(redirect => {
    createPage({
      path: redirect.from,
      component: redirectComponent,
      context: {
        redirectTo: redirect.to,
      },
    });
  });
};

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({node, getNode});

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createSchemaCustomization = ({actions}) => {
  const {createTypes} = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `);
};
