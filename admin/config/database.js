module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', '0.0.0.0'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false),
        // https://github.com/strapi/strapi/issues/2699#issuecomment-507959154
        charset: 'utf8mb4',
      },
      options: {
        /**
         * Updates database charset in order to accept special characters (such as emojis)
         *
         * NOTE: Make sure to update mysql manually from CLI. (https://stackoverflow.com/a/50264108)
         *       Affected tables: products, product_changes
         *
         * Sources:
         * - https://github.com/strapi/strapi/issues/2699#issuecomment-507959154
         * -
         */
         charset: 'utf8mb4',
      }
    },
  },
});
