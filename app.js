////////////////////////////////////
// Import Dependencies
////////////////////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
require("dotenv").config()
const DATABASE_URL = process.env.DATABASE_URL
const Recipe = require('./models/recipe')

////////////////////////////////////
// Routes
////////////////////////////////////


app.use(
  "/graphql",
  graphqlHTTP({
    //Any data after a ":" is the return value
    schema: buildSchema(`

    type Recipe {
      _id:ID!
      name: String!
      description: String
      instructions: String
      image: String
      ingredients:[String]
      quantities:[String]

    }

    input RecipeInput {
      name: String!
      description: String
      instructions: String
      image: String
      ingredients:[String]
      quantities:[String]
    }

  type RootQuery{
    recipes: [Recipe!]!
  }

  type RootMutation {
    createRecipe(recipeInput: RecipeInput): Recipe
  }
  
  schema{
    query: RootQuery
    mutation: RootMutation
  }
  
  `),
    //This has resolver functions that must match our schema
    rootValue: {
      //These must have the same names as the RootQuery and RootMutations above
      //These are really just functions that correspond to the list above
      recipes: () => {
        return Recipe.find()
          .then((recipes) => {
            return recipes.map((recipe) => {
              return {...recipe._doc}
            })
          })
          .catch((error) => {
            console.log(error);
          });
      },
      createRecipe: (args) => {
        const recipe = new Recipe({
          name: args.recipeInput.name,
          description: args.recipeInput.description,
          instructions: args.recipeInput.instructions,
          image: args.recipeInput.image,
          ingredients: args.recipeInput.ingredients,
          quantities: args.recipeInput.quantities,
        });
        return recipe
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },
    },
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

