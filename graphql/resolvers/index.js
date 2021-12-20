const bcrypt = require('bcryptjs')
const Recipe = require('../../models/recipe')
const User = require('../../models/user')


////////////////////////////////////
// Functions
////////////////////////////////////


const user = (id) => {
  return User.findById(id)
    .then((user) => {
      return {
        ...user._doc,
        createdRecipes: recipes(user._doc.createdRecipes),
      };
    })
    .catch((error) => {
      throw error;
    });
};

const recipes = (recipeIds) => {
  return Recipe.find({ _id: { $in: recipeIds } })
    .then((recipes) => {
      return recipes.map((recipe) => {
        return { ...recipe._doc, creator: user(recipe.creator) };
      });
    })
    .catch((error) => {
      throw error;
    });
};


////////////////////////////////////
// Resolvers
////////////////////////////////////




module.exports = {
  //These must have the same names as the RootQuery and RootMutations above
  //These are really just functions that correspond to the list above
  recipes: () => {
    let createdRecipe = {};
    return Recipe.find()
      .then((recipes) => {
        return recipes.map((recipe) => {
          return { ...recipe._doc, creator: user(recipe._doc.creator) };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  users: () => {
    return User.find({});
  },

  createRecipe: (args) => {
    const recipe = new Recipe({
      name: args.recipeInput.name,
      description: args.recipeInput.description,
      instructions: args.recipeInput.instructions,
      image: args.recipeInput.image,
      ingredients: args.recipeInput.ingredients,
      quantities: args.recipeInput.quantities,
      creator: "61be45b073fd39c6719f4193",
    })
    return recipe
      .save()
      .then((result) => {
        createdEvent = { ...result._doc, creator: user(result._doc.creator) };
        return User.findById("61be45b073fd39c6719f4193");
      })
      .then((user) => {
        user.createdRecipes.push(recipe);
        return user.save();
      })
      .then((result) => {
        return createdEvent;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },
  createUser: (args) => {
    return bcrypt
      .hash(args.userInput.password, 12)
      .then((password) => {
        const user = new User({
          username: args.userInput.username,
          password: password,
        });
        return user.save();
      })
      .then((result) => {
        return { ...result._doc, password: null };
      })
      .catch((error) => {
        throw error;
      });
  },
};
