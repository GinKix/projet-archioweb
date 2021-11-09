var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


//TEST JESS 
//router.get = ce qu'il se passe quand on fait un get avec l'url de la route
router.get('/nomRoute', function(req,res,next){
res.send('bonjour'); // envoi de réponse au client
});