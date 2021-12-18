const mongoose = require("mongoose");
const Schema = mongoose.Schema

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String, 
    
  },
  
  instructions: { type: String },
  
  image: { type: String },
  
  ingredients: [String],
  
  quantities: [String]
  
},
  
)

module.exports = mongoose.model('Recipe', recipeSchema)