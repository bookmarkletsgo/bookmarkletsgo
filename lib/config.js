export const serverOrigin =
  process.env.NODE_ENV === 'production'
    ? 'https://bookmarkletsgo.github.io'
    : process.env.CUSTOM_SERVER_ORIGIN || 'http://localhost:8090';
