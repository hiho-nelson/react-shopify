export const GET_BLOG_ARTICLES = `#graphql
  query GetBlogArticles($handle: String!, $first: Int! = 3) {
    blog(handle: $handle) {
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            excerpt
            publishedAt
            authorV2 { name }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

