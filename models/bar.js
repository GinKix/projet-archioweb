const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Create geolocation Schema
const geolocatedSchema = new Schema({
  location: {
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
  }
});

// Create a geospatial index on the location property.
geolocatedSchema.index({ location: '2dsphere' });

// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}


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

    geolocation: geolocatedSchema ,

//Rajout du schema geoloc et du rate by Yousra 


    picture: {
        data: Buffer,
        type: String
    },
    rate:{

      type :Schema.Types.ObjectId,
      ref:'Score'
    }


  });
  
  barSchema.set('toJSON', {
    transform: transformJsonBar
  });
  
  // Create the model from the schema and export it
  module.exports = mongoose.model('Bar', barSchema);