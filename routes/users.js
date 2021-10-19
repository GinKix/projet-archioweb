var express = require('express');
var router = express.Router();

/* Pas dans notre doc, pourquoi? */
router.get('/users', function(req, res, next) {
  res.send('Récupérer les utilisateurs');
});

router.post('/api/person/XX', function(req, res, next) {
  res.send('Ajouter un utilisateur');
});

router.delete('/api/person/XXX', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/api/person/XXX', function(req, res, next) {
  res.send('Modifier un utilisateur');
});

router.get('/api/person/XXX', function(req, res, next) {
  res.send('Modifier un utilisateur');
});

module.exports = router;
