var express = require('express');
var router = express.Router();

/* Pas dans notre doc, pourquoi? */
router.get('/users', function(req, res, next) {
  res.send('Récupérer les utilisateurs');
  console.log(req.method);  
  console.log(req.path);    
  console.log(req.params);  
  console.log(req.query);
});

router.post('/api/person', function(req, res, next) {
  res.send('Ajouter un utilisateur');
});

router.delete('/api/person/:IdPerson', function(req, res, next) {
  res.send('respond with a resource' + req.params.IdPerson);

  //faire un require dans ce document, ailleurs
  
});

router.put('/api/person/:IdPerson', function(req, res, next) {
  res.send('Modifier un utilisateur');
});

router.get('/api/person/:IdPerson', function(req, res, next) {
  res.send('Récupérer l\'utilisateur ' + req.params.IdPerson);
});

module.exports = router;
