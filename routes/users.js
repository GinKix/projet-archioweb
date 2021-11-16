const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticate } = require('./auth');
const config = require('../config');
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

/**
 * @api {get} /person/  Show all users
 * @apiName GetUser
 * @apiGroup User
 *
 */
router.get('/api/person', authenticate, function (req, res, next) {
  res.send('Récupérer les utilisateurs');
  console.log(req.method);
  console.log(req.path);
  console.log(req.params);
  console.log(req.query);
});



/**
 * @api {post} /person/ Create a user
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiSuccess {String} code 201: sucess
 * @apiSuccess {Function} savedPerson
 */
router.post('/api/person', function (req, res, next) {
  //res.send('Ajouter un utilisateur');
  const plainPassword = req.body.password;

  /* Version sans authentification
  new Person(req.body).save(function (err, savedPerson) {
    if (err) {
      return next(err);
    }

    res
      .status(201)
      .send(savedPerson);
  }); */

  bcrypt.hash(plainPassword, config.bcryptCostFactor, function (err, passwordHash) {

    if (err) {
      return next(err);
    }
    // Create a new document from the JSON in the request body
    const newPerson = new User(req.body);
    newPerson.password = passwordHash;

    // Save that document
    newPerson.save(function (err, savedPerson) {
      if (err) {
        return next(err);
      }
      // Send the saved document in the response
      res
        .status(201)
        .send(savedPerson);
    });
  });
});


/**
 * @api {delete} /person/:idPerson Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiSuccess {String} code 204: Sucess but no data to send
 * @apiSuccess {String} username
 */
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

/**
 * @api {put} /person/:IdPerson Modify a user
 * @apiName PutUser
 * @apiGroup User
 *
 * @apiSuccess {String} code 200: OK
 * @apiSuccess {String} Person updated: username
 */
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

/**
 * @api {get} /person/:IdPerson Get (not showing) a specific user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiSuccess {String} code 200: OK
 * @apiSuccess {Function} savedPerson
 */
router.get('/api/person/:IdPerson', authenticate, function (req, res, next) {
  //res.send('Récupérer l\'utilisateur ' + req.params.IdPerson);
  //futur contenu du middleware A
  Person.findById(req.params.IdPerson, function (err, person) {
    if (err) {
      return next(err);
    } else if (!person) {
      return personNotFound(res, req.params.IdPerson);
    }
    debug(req.person);
    req.sendStatus(200);

  });
});

/**
 * @api {post} /login/ Login a user
 * @apiName LogUser
 * @apiGroup User
 *
 * @apiError {String} code 401: Unauthorized
 * @apiSuccess {String} Welcome username !
 */

router.post('/api/login', function (req, res, next) {


  User.findOne({ name: req.body.name }).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return res.sendStatus(401);
    }

    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) {
        return next(err);
      } else if (!valid) {
        return res.sendStatus(401);
      }
      // Generate a valid JWT which expires in 7 days.
      const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
      const payload = { sub: user._id.toString(), exp: exp };
      jwt.sign(payload, config.secretKey, function (err, token) {
        if (err) {
          return next(err);
        }

        res.send({ token: token }); // Send the token to the client.        
      });

      res.send(`Welcome ${user.name}!`);
    });
  })
});

module.exports = router;