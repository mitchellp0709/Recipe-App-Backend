////////////////////////////////////
// Import Dependencies
////////////////////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const { graphqlHTTP } = require("express-graphql");

const mongoose = require("mongoose");
require("dotenv").config()
const DATABASE_URL = process.env.DATABASE_URL
const graphQlSchema = require("./graphql/schema/index")
const graphQlResolvers = require('./graphql/resolvers/index')


////////////////////////////////////
// Routes
////////////////////////////////////


app.use(
  "/graphql",
  graphqlHTTP({
    //Any data after a ":" is the return value
    schema: graphQlSchema,
    //This has resolver functions that must match our schema
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);










mongoose.connect(DATABASE_URL)
  .then(() => {
  app.listen(3000);
  })
  .catch((error) => {
  console.log(error)
})

