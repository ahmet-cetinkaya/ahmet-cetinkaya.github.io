/* eslint-disable import/prefer-default-export */

export function getPostUrl(post) {
  return `/blog/${post.fields.slug.split('/').at(-2)}`;
}
