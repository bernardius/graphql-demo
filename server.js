const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
      books: [Book]
    }
  type Book { 
      name: String,
      authors: [String]
      characters: [Character]
  }
  type Character {
      name: String
  }
`;

// The resolvers
const resolvers = {
  Query: { 
      books: async () => {
        const { data:books } = await axios.get('https://www.anapioficeandfire.com/api/books');
    
        console.log('book 1', books[0].name);
    
        return books;
      }
  },
  Book: {
      characters: async(parent) => {
        const { povCharacters } = parent; 

        if(povCharacters && povCharacters[0]) {
             let { data: character } = await axios.get(povCharacters[0]);
             console.log(character)
             return [character];
        } else {
            return [];
        }
      }
  }

};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});