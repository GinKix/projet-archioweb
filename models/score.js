const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for scores
const scoreSchema = new Schema({
  value: Double,
  userId: Int,
  barId: Int
});

// Create the model from the schema and export it
module.exports = mongoose.model('Score', scoreSchema);