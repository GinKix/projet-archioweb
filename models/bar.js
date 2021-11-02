const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for bars
const barSchema = new Schema({
    name: {
      type: String,
      unique: true
    },
    description: String,
    creationDate: Date,
    geolocation: String,
    picture: String
  });
  
  barSchema.set('toJSON', {
    transform: transformJsonBar
  });
  
  // Create the model from the schema and export it
  module.exports = mongoose.model('Bar', barSchema);