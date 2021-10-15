import express from 'express';
// import { ApolloServer, gql } from 'apollo-server-express';
import minimist from 'minimist';
import { createHash } from 'crypto';

import config from './config';
// import typeDefs from '@types';
// import resolvers from '@resolvers';

const args = minimist(process.argv);

const port = args.port ? args.port : config.port;
// const path = '/graphql';

// Initialize the app
const app = express();

// GraphQL Playground
// const playgroundEndpoint = args.apiRoot ? args.apiRoot : `/graphql`;

// // Initialize Appolo Server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   introspection: true,
//   playground: {
//     endpoint: playgroundEndpoint
//   }
// });

// server.applyMiddleware({ app, path });

app.get(config.ebay.marketplaceEndpoint, (req, res) => {
  // Create a hash for
  // eBay Marketplace Account Deletion/Closure Notifications
  // https://developer.ebay.com/marketplace-account-deletion
  const hash = createHash('sha256');
  const endpoint = `https://www.ifindilu.com/api${config.ebay.marketplaceEndpoint}`;
  const { verificationToken } = config.ebay;
  const { challenge_code } = req.query;

  hash.update(String(challenge_code));
  hash.update(verificationToken);
  hash.update(endpoint);

  console.log('Building challengeResponse for eBay verification...');
  console.log({ challenge_code, verificationToken, endpoint });

  const responseHash = hash.digest('hex');
  const challengeResponse = new Buffer.from(responseHash).toString();

  console.log('Generated challengeResponse:', challengeResponse);

  res.json({ challengeResponse });
});

app
.listen(port, () => {
  console.info(`API server now runs at http://localhost:${port}`);
});

