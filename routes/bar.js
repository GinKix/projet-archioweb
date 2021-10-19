//Comment faire quand on a une route qui passe par un identifiant de ressource?


//BARS
router.post("/api/bar", function (req, res, next) {
    res.send("Ajouter un bar "); // envoi de réponse au client
  });
  
  // à mettre à jour: trouver les bars proches, 
  //ce serait plus approprié d'utiliser un filtre sur 
  //GET /api/bar , par exemple GET /api/bar?closeTo=lng,lat
  router.get("/api/bar", function (req, res, next) {
      res.send("Afficher la liste des bars /!\ ajouter l'aggrégation ici"); // envoi de réponse au client
    });
  
  
    router.get("/api/bar/XXX", function (req, res, next) {
      res.send("Afficher un bar "); // envoi de réponse au client
    });
  
  
    router.put("/api/bar/XXX", function (req, res, next) {
      res.send("Modifier un bar "); // envoi de réponse au client
    });
  
  
    router.delete("/api/bar/XXX", function (req, res, next) {
      res.send("Supprimer un bar "); // envoi de réponse au client
    });
  

//RATINGS
router.get("/api/bar/XXX/rating", function (req, res, next) {
  res.send("Afficher le rating dun bar"); // envoi de réponse au client
});

router.post("/api/bar/XXX/rating", function (req, res, next) {
  res.send("Ajouter une note à un bar"); // envoi de réponse au client
});

router.delete("/api/barXXX/rating/YYY", function (req, res, next) {
  res.send("Supprimer une note à un bar"); // envoi de réponse au client
});

router.put("/api/bar/XXX/rating/YYY", function (req, res, next) {
  res.send("Modifier la note du bar"); // envoi de réponse au client
});

