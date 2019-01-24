const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const schema = require('./schema');
const resolvers = require('./resolvers');

console.log(ApolloServer);

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
 

(() => {
    const app = express();

    const server = new ApolloServer({ typeDefs, resolvers });

    server.applyMiddleware({ app });

    return app;
})();

setupGraphQLServer();




