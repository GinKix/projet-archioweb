const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for users
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  registrationDate: Date,
  geolocation: String


});

userSchema.set('toJSON', {
  transform: transformJsonUser
});

function transformJsonUser(doc, json, options) {
  // Remove the hashed password from the generated JSON.
  delete json.password;
  delete json.__v;
  return json;
}

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);