const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Recipe {
      _id:ID!
      name: String!
      description: String
      instructions: String
      image: String
      ingredients:[String]
      quantities:[String]
      creator: User!
    }

    type User {
      _id: ID!
      username: String!
      password: String
      createdRecipes: [Recipe!]
    }

    input RecipeInput {
      name: String!
      description: String
      instructions: String
      image: String
      ingredients:[String]
      quantities:[String]
    }

    input UserInput {
    username: String!
    password: String!
    }

  type RootQuery{
    recipes: [Recipe!]!
    users:[User!]!
  }

  type RootMutation {
    createRecipe(recipeInput: RecipeInput): Recipe
    createUser(userInput: UserInput): User
  }
  
  schema{
    query: RootQuery
    mutation: RootMutation
  }
  
  `);
