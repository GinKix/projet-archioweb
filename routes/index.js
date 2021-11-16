const express = require('express');
const user = require('../models/user');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


//TEST JESS 
//router.get = ce qu'il se passe quand on fait un get avec l'url de la route
router.get('/nomRoute', function(req,res,next){

  if ( navigator.geolocation ) {
    // On demande d'envoyer la position courante 
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      geolocation.user=(lat,lng);
    }
    )
  }
   
    else {
      // Function alternative sinon
      alternative();
    }

res.send('bonjour'); // envoi de réponse au client
});
