//Comment faire quand on a une route qui passe par un identifiant de ressource?
//importer les schémas dans le dossier model

const { Db } = require("mongodb");



function barNotFound(res, barId) {
  return res.status(404).type('text').send(`No bar found with ID ${barId}`);
};


function RatingNotFound(res, barId) {
  return res.status(404).type('text').send(`No rating found for this bar: ${barId}`);
};
//BARS


/**
 * @api {post} /api/bar Request add bar
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess code status: 201
 * 
 */
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

/**
 * @api {get} /api/bar
 * @apiName RetrieveBar
 * @apiGroup Bar
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a paginated list of bar sorted by name (in alphabetical order).
 *
 * @apiUse BarInResponseBody
 * @apiUse Pagination
 *
 * @apiParam (URL query parameters) /api/bar?closeTo=lng,lat
 *
 * @apiExample Example
 *     GET /api/bar?closeTo=lng,lat
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: &lt;https://projet-archioweb.herokuapp.com/api/bar?closeTo=lng,lat;; rel="first prev"
 *
 *    
 */
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

    Bar.aggregate([
        {
          $lookup: {
            from: 'bar',
            localField: 'idBar',
            foreignField: 'IdRating',
            as: 'ratedBar'
          }
        },
        {
            $unwind: {
              path: '$ratedBar',
              // Preserve bar without rating
              // ("ratedBar" will be null).
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              IdBar: '$idBar',
              rating: { $avg: '$rating' },
              name: { $first: '$name' },

              
            }
          },
        
          {
            $sort: {
              name: 1
            }
          },
          {
            $skip: (page - 1) * pageSize
          },
          {
            $limit: pageSize
          }
        ], (err, bar) => {
            if (err) {
              return next(err);
            }
    
 
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
    
      res.send(bar); // envoi de réponse au client

    });
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



  new Rating(req.body).save(function (err, savedRating) {

    Rating.findById(req.params.IdRating.value, function (err, bar) {
      if (err) {
        return next(err);
      } else if (!rating) {
        return RatingNotFound(res, req.params.IdRating);
      }
      debug(req.Rating);
      res
        .send(savedRating)
        .status(201);
    });
  });
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

  Rating.findById(req.params.IdRating, function (err, savedRating) {
    if (err) {
      return next(err);
    } else if (!rating) {
      return personNotFound(res, req.params.IdRating);
    }


    rating.remove(function (err) {
      if (err) {
        return next(err);
      }

      debug(`Deleted rating "${req.rating.id}"`);
      res.sendStatus(204);
    });
  });

});

router.put("/api/bar/:IdBar/rating/:IdRating", function (req, res, next) {
  //res.send("Modifier la note du bar"); // envoi de réponse au client
  Rating.findById(req.params.IdRating, function (err, savedRating) {
    if (err) {
      return next(err);
    } else if (!rating) {
      return personNotFound(res, req.params.IdRating);
    }

    rating.update(function (err) {

      if (err) {
        return next(err);
      }

      debug(`Rating updated: "${req.rating.id}"`);
      res.sendStatus(200);
    });

  });

});
