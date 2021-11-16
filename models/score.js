const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for rating
const ratingchema = new Schema({
  value: Double,
  idRating :{ Int,  unique: true} ,
  userId: Int,
  idBar: Int
});

// Create the model from the schema and export it
module.exports = mongoose.model('Rating', scoreSchema);