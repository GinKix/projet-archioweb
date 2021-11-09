//Comment faire quand on a une route qui passe par un identifiant de ressource?
//importer les schémas dans le dossier model

const { Db } = require("mongodb");

//BARS
router.post("/api/bar", function (req, res, next) {

  //Rajout des filtres, pagination ... By Yousra 
  res.send("Ajouter un bar "); // envoi de réponse au client
  //cf slides mongoose et integration mongooseExpress

  //essai 1
  const bar = new Bar({
    //const bar = new Bar(req.body);
    //bar.save()
  });

});

// à mettre à jour: trouver les bars proches, 
//ce serait plus approprié d'utiliser un filtre sur 
//GET /api/bar , par exemple GET /api/bar?closeTo=lng,lat
router.get("/api/bar", function (req, res, next) {
  res.send("Afficher la liste des bars /!\ ajouter l'aggrégation ici"); // envoi de réponse au client
});


router.get("/api/bar/:IdBar", function (req, res, next) {
  res.send("Afficher un bar "); // envoi de réponse au client


  // Bar.find()
});


router.put("/api/bar/:IdBar", function (req, res, next) {
  res.send("Modifier un bar "); // envoi de réponse au client
});


router.delete("/api/bar/:IdBar", function (req, res, next) {
  res.send("Supprimer un bar "); // envoi de réponse au client
});


//RATINGS
router.get("/api/bar/:IdBar/rating", function (req, res, next) {
  res.send("Afficher le rating dun bar"); // envoi de réponse au client
});

router.post("/api/bar/:IdBar/rating", function (req, res, next) {
  res.send("Ajouter une note à un bar"); // envoi de réponse au client
});

router.delete("/api/:IdBar/rating/:IdRating", function (req, res, next) {
  res.send("Supprimer une note à un bar"); // envoi de réponse au client
});

router.put("/api/bar/:IdBar/rating/:IdRating", function (req, res, next) {
  res.send("Modifier la note du bar"); // envoi de réponse au client
});

