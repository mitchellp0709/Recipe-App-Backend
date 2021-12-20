const bcrypt = require('bcryptjs')
const Recipe = require('../../models/recipe')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')


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

const recipes = async (recipeIds) => {
  try{
    const recipes = await Recipe.find({ _id: { $in: recipeIds } })
    return recipes.map((recipe) => {
      return { ...recipe._doc, creator: user(recipe.creator) };
    })
  } catch(error) {
      throw error;
    };
};

const transformRecipe = ((recipe) => {
  return {...recipe._doc, creator: user(recipe._doc.creator)}
})

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
          return transformRecipe(recipe)
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  users: () => {
    return User.find({});
  },

  createRecipe: (args, req) => {
    // if (req.isAuth == false) {
    //   throw new Error('Not Logged In')
    // }
    const recipe = new Recipe({
      name: args.recipeInput.name,
      description: args.recipeInput.description,
      instructions: args.recipeInput.instructions,
      image: args.recipeInput.image,
      ingredients: args.recipeInput.ingredients,
      quantities: args.recipeInput.quantities,
      creator: req.userId,
    })
    return recipe
      .save()
      .then((result) => {
        createdRecipe = transformRecipe(result);
        return User.findById(req.userId);
      })
      .then((user) => {
        user.createdRecipes.push(recipe);
        return user.save();
      })
      .then((result) => {
        return createdRecipe;
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
  login: async ({ username, password }) => {
    const user = await User.findOne({ username: username });
    if (user==undefined) {
      throw new Error("User does not exist");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual==false) {
      throw new Error("Password is incorrect")
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, 'IROH')
    return{userId: user._id, token: token, }
  }
};
