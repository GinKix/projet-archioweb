const debug = require('debug')('projet:users');
var express = require('express');
var router = express.Router();

/**
 * @api {get} /users/:id Request a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 */

//sert à envoyer la réponse "personne pas trouvée"
function personNotFound(res, personId) {
  return res.status(404).type('text').send(`No person found with ID ${personId}`);
};

/* Pas dans notre doc, pourquoi? */
router.get('/users', function (req, res, next) {
  res.send('Récupérer les utilisateurs');
  console.log(req.method);
  console.log(req.path);
  console.log(req.params);
  console.log(req.query);
});

router.post('/api/person', function (req, res, next) {
  //res.send('Ajouter un utilisateur');
  new Person(req.body).save(function (err, savedPerson) {
    if (err) {
      return next(err);
    }

    res
      .status(201)
      .send(savedPerson);
  });
});



router.delete('/api/person/:IdPerson', /* utils.requireJson, */ function (req, res, next) {
  //On ne peut avoir qu'une res par route car seule la première réponse est présentée au client, après ça fait des erreurs
  // res.send('respond with a resource' + req.params.IdPerson);

  //à mettre dans un middleware  A plus tard
  Person.findById(req.params.IdPerson, function (err, person) {
    if (err) {
      return next(err);
    } else if (!person) {
      return personNotFound(res, req.params.IdPerson);
    }


    person.remove(function (err) {
      if (err) {
        return next(err);
      }

      debug(`Deleted person "${req.person.username}"`);
      res.sendStatus(204);
    });

  });


  //faire un require dans ce document, ailleurs

});

router.put('/api/person/:IdPerson', function (req, res, next) {
  //res.send('Modifier un utilisateur');

  //futur contenu du middleware A
  Person.findById(req.params.IdPerson, function (err, person) {
    if (err) {
      return next(err);
    } else if (!person) {
      return personNotFound(res, req.params.IdPerson);
    }

    person.update(function (err) {
      if (err) {
        return next(err);
      }

      debug(`Person updated: "${req.person.username}"`);
      res.sendStatus(200);
    });
  });
});

router.get('/api/person/:IdPerson', function (req, res, next) {
  //res.send('Récupérer l\'utilisateur ' + req.params.IdPerson);
  //futur contenu du middleware A
  Person.findById(req.params.IdPerson, function (err, person) {
    if (err) {
      return next(err);
    } else if (!person) {
      return personNotFound(res, req.params.IdPerson);
    }
    debug(req.person);
    res.sendStatus(200);

  });
});

module.exports = router;