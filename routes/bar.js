//Comment faire quand on a une route qui passe par un identifiant de ressource?
//importer les schémas dans le dossier model

const { Db } = require("mongodb");

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

function barNotFound(res, barId) {
  return res.status(404).type('text').send(`No bar found with ID ${barId}`);
};
//BARS
router.post("/api/bar", function (req, res, next) {


  res.send("Ajouter un bar "); // envoi de réponse au client
  //cf slides mongoose et integration mongooseExpress

  new Bar(req.body).save(function (err, savedBar) {
    if (err) {
      return next(err);
    }

    res
      .status(201)
      .send(savedBar);

  });

});

// à mettre à jour: trouver les bars proches, 
//ce serait plus approprié d'utiliser un filtre sur 
//GET /api/bar , par exemple GET /api/bar?closeTo=lng,lat
router.get("/api/bar", function (req, res, next) {


  // Count total bar matching the URL query parameters
  const countQuery = queryBar(req);
  countQuery.count(function (err, total) {
    if (err) {
      return next(err);
    }

    // Prepare the initial database query from the URL query parameters
    let query = queryBar(req);

    // Parse pagination parameters from URL query parameters
    const { page, pageSize } = pag.getPaginationParameters(req);

    // Apply the pagination to the database query
    query = query.skip((page - 1) * pageSize).limit(pageSize);
    // Add the Link header to the response
    pag.addLinkHeader('/api/bar', page, pageSize, total, res);
    // Filter bar by rate
    if (ObjectId.isValid(req.query.rate)) {
      query = query.where('rate').equals(req.query.rate);
    }

    // Execute the query
    query.sort({ name: 1 }).exec(function (err, bar) {
      if (err) {
        return next(err);
      }

      res.send("Afficher la liste des bars /!\ ajouter l'aggrégation ici"); // envoi de réponse au client

    });
  });
});



router.get("/api/bar/:IdBar", function (req, res, next) {
  res.send("Afficher un bar "); // envoi de réponse au client


  // Bar.find()
});


router.put("/api/bar/:IdBar", function (req, res, next) {
  //res.send("Modifier un bar "); // envoi de réponse au client

  //futur contenu du middleware B
  Bar.findById(req.params.IdBar, function (err, bar) {
    if (err) {
      return next(err);
    } else if (!bar) {
      return barNotFound(res, req.params.IdBar);
    }

    bar.update(function (err) {
      if (err) {
        return next(err);
      }

      debug(`Bar  updated: "${req.bar.name}"`);
      res.sendStatus(200);
    });
  });

});


router.delete("/api/bar/:IdBar", function (req, res, next) {
  //res.send("Supprimer un bar "); // envoi de réponse au client
  Bar.findById(req.params.IdBar, function (err, bar) {
    if (err) {
      return next(err);
    } else if (!bar) {
      return barNotFound(res, req.params.IdBar);
    }


    bar.remove(function (err) {
      if (err) {
        return next(err);
      }

      debug(`Deleted bar "${req.bar.name}"`);
      res.sendStatus(204);
    });
  });

});


//RATINGS
router.get("/api/bar/:IdBar/rating", function (req, res, next) {
  //res.send("Afficher le rating dun bar");

  // envoi de réponse au client
  /* A reprendre, probablement erreur, doit-on mettre savedScore ou Score?
  
  new Score(req.body).save(function (err, savedScore) {
 
     Score.findById(req.params.IdScore.value, function (err, bar) {
       if (err) {
         return next(err);
       } else if (!score) {
         return barNotFound(res, req.params.IdScore);
       }
       debug(req.Score);
       res
       .send(savedScore)
       .status(201);
     });
}); */
});

router.post("/api/bar/:IdBar/rating", function (req, res, next) {
  //res.send("Ajouter une note à un bar"); // envoi de réponse au client
  new Rating(req.body).save(function (err, savedRating) {
    if (err) {
      return next(err);
    }

    res
      .status(201)
      .send(savedRating);


  });
});

router.delete("/api/:IdBar/rating/:IdRating", function (req, res, next) {
  //res.send("Supprimer une note à un bar"); // envoi de réponse au client

  Score.findById(req.params.IdScore, function (err, savedRating) {
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

});

router.put("/api/bar/:IdBar/rating/:IdRating", function (req, res, next) {
  res.send("Modifier la note du bar"); // envoi de réponse au client
});
