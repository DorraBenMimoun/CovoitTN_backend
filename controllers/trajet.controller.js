const Trajet = require('../models/trajet.model.js');
const Reservation = require('../models/reservation.model.js');

// Create and Save a new Trajet
exports.createTrajet = async (req, res) => {
  try {
    // S'assurer que les points de départ et d'arrivée contiennent les coordonnées lat et lng
    const { pointDepart, pointArrivee } = req.body;

    if (!pointDepart) {
      return res
        .status(400)
        .json({ message: 'Les coordonnées du point de départ sont requises.' });
    }

    if (!pointArrivee) {
      return res
        .status(400)
        .json({ message: "Les coordonnées du point d'arrivée sont requises." });
    }
    const trajet = await Trajet.create(req.body);
    res.status(200).json(trajet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Retrieve all Trajets from the database.
exports.getTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find().populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Find a single Trajet with an id
exports.getTrajetById = async (req, res) => {
  try {
    const id = req.params.id;
    const trajet = await Trajet.findById(id).populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );
    res.status(200).json(trajet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update a Trajet by the id in the request
exports.updateTrajet2 = async (req, res) => {
  try {
    const id = req.params.id;

    // VALIDATION DES CHAMPS

    // TODO : 1- Récuperer les reservations du trajet
    //        2- Calculer le nombre de places restantes
    //        3- Mettre à jour le trajet avec le nombre de places restantes

    // Si nbr place dispo update par user  < 0 ou > reservation tu renvoie erreur

    // Prix entre min et max <= Recalculer le prix si update destination or depart

    // TODO : SI deja reservation renvoyer erreur SI update prix ou nbr place dispo ou heure ou destination ou depart

    // TODO : Si update fumeur, animaux, fille uniquement, max passager arriere, marque voiture, couleur voiture informer les passagers
    const trajet = await Trajet.findByIdAndUpdate(id, req.body, { new: true });

    if (!trajet) {
      res.status(404).json({ message: 'Trajet not found' });
    }
    const updatedTrajet = await Trajet.findById(id);
    res.status(200).json(updatedTrajet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a Trajet by the id in the request
exports.updateTrajet = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    // Récupérer le trajet actuel
    const trajet = await Trajet.findById(id);
    console.log('ancien trajet:', trajet);

    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    // 1- Récupérer les réservations associées à ce trajet
    const reservations = await Reservation.find({ idTrajet: id });

    // 2- Calculer le nombre de places restantes
    const nbrPlacesReservees = reservations.reduce(
      (sum, res) => sum + res.nbrPlacesReservees,
      0,
    );
    const placesRestantes = trajet.placesDispo - nbrPlacesReservees;

    // Vérification si le nombre de places disponibles mis à jour est inférieur à 0 ou dépasse le nombre de réservations existantes
    if (
      updatedData.placesDispo < nbrPlacesReservees ||
      updatedData.placesDispo < 0
    ) {
      return res.status(400).json({ message: 'Nombre de places invalides.' });
    }

    // Vérification des modifications interdites si des réservations existent
    const restrictedFields = [
      'prix',
      'placesDispo',
      'heureDepart',
      'destination',
      'depart',
    ];
    if (
      reservations.length > 0 &&
      restrictedFields.some(
        (field) =>
          updatedData[field] !== undefined &&
          updatedData[field] !== trajet[field],
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            'Impossible de modifier certaines informations car des réservations existent.',
        });
    }

    // Vérifier si le prix est dans une plage valide si la destination ou le départ est mis à jour
    /*if ((updatedData.destination || updatedData.depart) && (updatedData.prix < trajet.prixMin || updatedData.prix > trajet.prixMax)) {
      return res.status(400).json({ message: 'Le prix est hors de la plage autorisée.' });
    }*/

    // Vérification des champs qui nécessitent une notification aux passagers
    /*const notificationFields = ['fumeur', 'animaux', 'filleUniquement', 'maxPassagersArriere', 'marqueVoiture', 'couleurVoiture'];
    const fieldsToNotify = notificationFields.filter(field => updatedData[field] !== undefined && updatedData[field] !== trajet[field]);
    if (fieldsToNotify.length > 0) {
      // TODO : Informer les passagers des modifications
      // Exemple : sendNotificationToPassengers(trajet, fieldsToNotify);
    }
*/
    // Mettre à jour le trajet
    const updatedTrajet = await Trajet.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedTrajet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a Trajet with the specified id in the request
exports.deleteTrajet = async (req, res) => {
  try {
    const id = req.params.id;
    const trajet = await Trajet.findByIdAndDelete(id);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet not found' });
    }

    // TODO : Si trajet a des reservations : annuler les reservation, informer les users

    // Recuperer le trajet et l'envoyer a check if is authorized avant de le supprimer
    // checkIfIsAuthorized(req, trajet, res);

    return res.status(200).json(trajet); // Non
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const checkIfIsAuthorized = (req, trajet, res) => {
  if (!req.user || trajet.idConducteur.toString() != req.user._id.toString()) {
    return res
      .status(401)
      .json({ message: 'You are not authorized to do this action' });
  }
};

// Delete all Trajets from the database.
exports.deleteAllTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.deleteMany();
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all trajets by passager
exports.getTrajetsByPassager = async (req, res) => {
  try {
    const id = req.params.id;
    const reservations = await Reservation.find({ idPassager: id });
    const trajets = await Trajet.find({
      _id: { $in: reservations.map((res) => res.idTrajet) },
    });
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all tragets by conducteur
exports.getTrajetsByConducteur = async (req, res) => {
  try {
    const id = req.params.id;
    const trajets = await Trajet.find({ idConducteur: id });
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to normalize the terms (remove special characters like hyphens, underscores, etc.)
function normalizeTerm(term) {
  return term.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); // Retire les caractères non alphanumériques et met en minuscule
}

// Function to create a regex that ignores special characters between letters
function createRegexForTerm(term) {
  const normalizedTerm = normalizeTerm(term);
  // Create a regex that matches the normalized term with optional characters between the letters
  return new RegExp(normalizedTerm.split('').join('[^a-zA-Z0-9]*'), 'i'); // 'i' for case-insensitive
}

exports.filterTrajets = async (req, res) => {
  try {
    console.log('Requête reçue avec paramètres:', req.query);

    // Récupération des critères de filtrage depuis les paramètres de la requête
    const {
      pointArriveeTerm,
      pointDepartTerm,
      fumeur,
      animaux,
      filleUniquement,
      placesDispo,
    } = req.query;

    // Vérification de la présence du terme du point d'arrivée (obligatoire)
    if (!pointArriveeTerm) {
      return res
        .status(400)
        .json({ message: "Le terme du point d'arrivée est obligatoire." });
    }

    // Normalisation des termes (supprime les tirets, underscores, etc.)
    const regexPointArriveeTerm = createRegexForTerm(pointArriveeTerm);
    const regexPointDepartTerm = pointDepartTerm
      ? createRegexForTerm(pointDepartTerm)
      : null;

    // Construction dynamique de la requête de filtrage
    const filtre = {
      'pointArrivee.terms': {
        $elemMatch: { value: { $regex: regexPointArriveeTerm } },
      },
    };

    if (regexPointDepartTerm) {
      filtre['pointDepart.terms'] = {
        $elemMatch: { value: { $regex: regexPointDepartTerm } },
      };
    }
    if (fumeur !== undefined) {
      filtre.fumeur = fumeur === 'true'; // Convertir en booléen
    }
    if (animaux !== undefined) {
      filtre.animaux = animaux === 'true'; // Convertir en booléen
    }
    if (filleUniquement !== undefined) {
      filtre.filleUniquement = filleUniquement === 'true'; // Convertir en booléen
    }
    if (placesDispo) {
      filtre.placesDispo = { $gte: Number(placesDispo) }; // Vérifie que les places disponibles sont suffisantes
    }

    console.log('Filtres utilisés:', filtre);
    console.log('Filtres utilisés 2:', JSON.stringify(filtre, null, 2));

    // Exécution de la requête avec les filtres construits
    const trajets = await Trajet.find(filtre).populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );

    // Retour des trajets filtrés
    res.status(200).json(trajets);
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors du filtrage des trajets:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.quickSearch = async (req, res) => {
  try {
    console.log('Requête reçue avec paramètre de recherche:', req.query);

    // Récupération du terme de recherche depuis les paramètres de la requête
    const { searchTerm } = req.query;

    // Vérification que le terme de recherche est présent
    if (!searchTerm) {
      return res
        .status(400)
        .json({ message: 'Le terme de recherche est obligatoire.' });
    }

    // Génération de l'expression régulière
    const regexSearchTerm = createRegexForTerm(searchTerm);

    console.log(
      'Expression régulière générée pour le terme de recherche:',
      regexSearchTerm,
    );

    if (!regexSearchTerm) {
      return res
        .status(400)
        .json({ message: 'Expression régulière invalide.' });
    }

    // Construction des filtres
    const filtre = {
      $or: [
        { 'pointArrivee.terms': { $elemMatch: { value: regexSearchTerm } } },
        { 'pointDepart.terms': { $elemMatch: { value: regexSearchTerm } } },
      ],
    };

    console.log('Filtres utilisés pour la recherche rapide:', filtre);
    console.log('Filtres utilisés 2:', JSON.stringify(filtre, null, 2));

    // Exécution de la requête avec le filtre construit
    const trajets = await Trajet.find(filtre).populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );

    // Retour des résultats trouvés
    res.status(200).json(trajets);
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la recherche rapide:', err);
    res.status(500).json({ message: err.message });
  }
};

const PRIX_ESSENCE = 2.525; // Prix le litre d'essence en dinar
const DISTANCE_PAR_LITRE = 20; // Distance en km par litre d'essence

exports.getEstimationPrix = async (req, res) => {
  try {
    const { distance } = req.params;

    // Validation: vérifier si la distance est fournie et si elle est un nombre valide
    if (!distance) {
      return res.status(400).json({ message: 'La distance est requise.' });
    }

    console.log(distance);
    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      return res.status(400).json({
        message: 'Veuillez fournir une distance valide (un nombre positif).',
      });
    }

    // Calcul du prix estimé
    const litresRequis = distanceNum / DISTANCE_PAR_LITRE; // Nombre de litres nécessaires
    const prixEstime = litresRequis * PRIX_ESSENCE; // Coût total en dinars

    // Retourner une fourchette avec prix min et max
    // Arrondi au plus grand nombre entier
    const min = prixEstime < 1 ? 1 : Math.round(prixEstime);
    const max = min + 2;

    // Réponse avec le prix estimé
    res.status(200).json({
      distance: distanceNum,
      prixEstime: prixEstime,
      minPrix: min,
      maxPrix: max,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
