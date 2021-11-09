const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for bars
const barSchema = new Schema({
    name: {
      type: String,
      unique: true
    },
    description: {
        type: String,
        required: true,
    },

    creationDate: {
        type: Date,
        default: Date.now
    },

    lastModifiedDate: {
        type: Date,
        default: Date.now
    },

    geolocation: {
        type: {
            type: String,
            required: true,
            enum: [ 'Point' ]
          },
          coordinates: {
            type: [ Number ],
            required: true,
            validate: {
              validator: validateGeoJsonCoordinates,
              message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
            
          }
        }
      
    },



    picture: {
        data: Buffer,
        type: String
    }

  });
  
  barSchema.set('toJSON', {
    transform: transformJsonBar
  });
  
  // Create the model from the schema and export it
  module.exports = mongoose.model('Bar', barSchema);