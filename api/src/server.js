import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import minimist from 'minimist';

import config from './config';
import typeDefs from '@types';
import resolvers from '@resolvers';

const args = minimist(process.argv);

const port = args.port ? args.port : config.port;
const path = '/graphql';

// Initialize the app
const app = express();

// GraphQL Playground
const playgroundEndpoint = args.apiRoot ? args.apiRoot : `/graphql`;

// Initialize Appolo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    endpoint: playgroundEndpoint
  }
});

server.applyMiddleware({ app, path });

app
.listen(port, () => {
  console.info(`ApolloServer now runs at http://localhost:${port}`);
});

