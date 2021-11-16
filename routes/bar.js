const { authenticate } = require('./auth');
const express = require('express');
const router = express.Router();
const { Db } = require("mongodb");



function barNotFound(res, barId) {
  return res.status(404).type('text').send(`No bar found with ID ${barId}`);
};


function RatingNotFound(res, barId) {
  return res.status(404).type('text').send(`No rating found for this bar: ${barId}`);
};
//BARS


/**
 * @api {post} /bar/ Create a bar
 * @apiName PostBar
 * @apiGroup Bar
 *
 * @apiSuccess {String} code 201: sucess
 * @apiSuccess {Function} savedBar
 */
router.post("/api/bar", authenticate, function (req, res, next) {


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
 * @api {get} /bar/ Show all the bar
 * @apiName GetBar
 * @apiGroup Bar
 *
 * @apiSuccess {String} code 201: sucess
 * @apiSuccess {Function} savedBar
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

    //filtrer par les bar les plus proches des données recupérées avec la requête par exemple GET /api/bars?lat=latitude&lng=longitude
    bar.geoNear(
      { type: "point", coordinates: [parseFloate(req.query.lng), parseFloate(req.query.lat)] },
      { maxDistance: 1000, spherical: true }
    ).then(function (bar) { res.send(bar); });

    // Parse pagination parameters from URL query parameters
    const { page, pageSize } = pag.getPaginationParameters(req);
    // Apply the pagination to the database query
    query = query.skip((page - 1) * pageSize).limit(pageSize);
    
   

    Bar.aggregate([
      {
        $lookup: {
          from: 'bar',
          localField: 'idBar',
          foreignField: 'idRating',
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
          idBar: '$idBar',
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

        res
          .status(200)
          .send(bar); // envoi de réponse au client

      });
    });
  });

});


/**
 * @api {get} /bar/ Show one bar
 * @apiName GetBar
 * @apiGroup Bar
 *
 * @apiSuccess {String} code 200: OK
 * @apiError {Function} barNotFound 
 */
router.get("/api/bar/:idBar", function (req, res, next) {
  //res.send("Afficher un bar "); // envoi de réponse au client

  Bar.findById(req.params.idBar, function (err, bar) {
    if (err) {
      return next(err);
    } else if (!bar) {
      return barNotFound(res, req.params.idBar);
    }
    debug(req.bar);
    res.sendStatus(200);

  });

});

/**
 * @api {put} /bar/ Modify one bar
 * @apiName PutBar
 * @apiGroup Bar
 *
 * @apiSuccess {String} code 200: OK
 * @apiError {Function} barNotFound 
 */
router.put("/api/bar/:idBar", authenticate, function (req, res, next) {
  //res.send("Modifier un bar "); // envoi de réponse au client

  Bar.findById(req.params.idBar, function (err, bar) {
    if (err) {
      return next(err);
    } else if (!bar) {
      return barNotFound(res, req.params.idBar);
    }

    bar.update(function (err) {
      if (err) {
        return next(err);
      }

      debug(`Bar updated: "${req.bar.name}"`);
      res.sendStatus(200);
    });
  });

});

/**
 * @api {delete} /bar/ Delete one bar
 * @apiName DeleteBar
 * @apiGroup Bar
 *
 * @apiSuccess {String} code 204: No content
 * @apiError {Function} barNotFound 
 */

router.delete("/api/bar/:idBar", authenticate, function (req, res, next) {
  //res.send("Supprimer un bar "); // envoi de réponse au client
  Bar.findById(req.params.idBar, function (err, bar) {
    if (err) {
      return next(err);
    } else if (!bar) {
      return barNotFound(res, req.params.idBar);
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

/**
 * @api {get} /bar/:IdBar/rating Return the rating of one bar
 * @apiName GetRating
 * @apiGroup Rating
 *
 * @apiSuccess {String} code 201: sucess
 * @apiError {Function} RatingNotFound 
 */
router.get("/api/bar/:idBar/rating", function (req, res, next) {
  //res.send("Afficher le rating dun bar");
  new Rating(req.body).save(function (err, savedRating) {

    Rating.findById(req.params.idRating.value, function (err, bar) {
      if (err) {
        return next(err);
      } else if (!rating) {
        return RatingNotFound(res, req.params.idRating);
      }
      debug(req.rating);
      res
        .send(savedRating)
        .status(201);
    });
  });
});


/**
 * @api {post} /bar/:IdBar/rating Create a rating of one bar
 * @apiName PostRating
 * @apiGroup Rating
 *
 * @apiSuccess {String} code 201: sucess
 * @apiSuccess {Function} savedRating
 * @apiError {Function} RatingNotFound 
 */
router.post("/api/bar/:idBar/rating", authenticate, function (req, res, next) {
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

/**
 * @api {delete} /bar/:IdBar/rating Delete the rating of one bar
 * @apiName DeleteRating
 * @apiGroup Rating
 *
 * @apiSuccess {String} code 204: No content
 * @apiSuccess {String} Deleted rating IdRating
 * @apiError {Function} RatingNotFound 
 */

router.delete("/api/:IdBar/rating/:idRating", authenticate, function (req, res, next) {
  //res.send("Supprimer une note à un bar"); // envoi de réponse au client

  Rating.findById(req.params.idRating, function (err, savedRating) {
    if (err) {
      return next(err);
    } else if (!rating) {
      return RatingNotFound(res, req.params.idRating);
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

/**
 * @api {put} /bar/:IdBar/rating Modifiy the rating of one bar
 * @apiName PutRating
 * @apiGroup Rating
 *
 * @apiSuccess {String} code 200: OK
 * @apiSuccess {String} Rating updated IdRating
 * @apiError {Function} RatingNotFound 
 */
router.put("/api/bar/:idBar/rating/:idRating", authenticate, function (req, res, next) {
  //res.send("Modifier la note du bar"); // envoi de réponse au client
  Rating.findById(req.params.idRating, function (err, savedRating) {
    if (err) {
      return next(err);
    } else if (!rating) {
      return RatingNotFound(res, req.params.idRating);
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
