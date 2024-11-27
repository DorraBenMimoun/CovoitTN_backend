const Trajet = require('../models/trajet.model.js');
const Reservation = require('../models/reservation.model.js'); 

/*const axios = require('axios');

async function getDistanceAndDurationFromOpenRouteService(pointDepart, pointArrivee) {
    const apiKey = '5b3ce3597851110001cf6248c123d2b11bb649b1b84f8eda41f463d3'; // Remplacez par votre clé API OpenRouteService
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pointDepart.lng},${pointDepart.lat}&end=${pointArrivee.lng},${pointArrivee.lat}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("data: ", data);
        console.log("features: ", data.features);

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const distance = feature.properties.summary.distance / 1000; // Distance en km
            const duration = feature.properties.summary.duration / 60;   // Durée en minutes
            return { distance, duration };
        } else {
            throw new Error('Impossible de calculer la distance et la durée - Aucune donnée trouvée.');
        }
    } catch (error) {
        console.error(`Erreur API: ${error.response ? error.response.status : 'Inconnu'} - ${error.message}`);
        if (error.response && error.response.data) {
            console.error(`Détails de l'erreur: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error('Erreur lors de la communication avec l\'API OpenRouteService.');
    }
}
*/
/*exports.createTrajet2 = async (req, res) => {
    try {
        const { pointDepart, pointArrivee } = req.body;
        console.log("point depart: ", pointDepart);
        console.log("point arrivee: ", pointArrivee);

        if (!pointDepart || !pointDepart.lat || !pointDepart.lng) {
            return res.status(400).json({ message: "Les coordonnées du point de départ sont requises." });
        }

        if (!pointArrivee || !pointArrivee.lat || !pointArrivee.lng) {
            return res.status(400).json({ message: "Les coordonnées du point d'arrivée sont requises." });
        }

        // Obtenir la distance et la durée à partir de OpenRouteService
        const { distance, duration } = await getDistanceAndDurationFromOpenRouteService(pointDepart, pointArrivee);

        // Ajouter les valeurs calculées au corps de la requête
        req.body.distance = distance;
        req.body.duree = duration;

        // Créer et enregistrer le trajet
        const trajet = await Trajet.create(req.body);
        res.status(200).json(trajet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
*/

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
    const trajets = await Trajet.find();
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Find a single Trajet with an id
exports.getTrajetById = async (req, res) => {
  try {
    const id = req.params.id;
    const trajet = await Trajet.findById(id);
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
    console.log('ancien trajet:',trajet);

    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    // 1- Récupérer les réservations associées à ce trajet
    const reservations = await Reservation.find({ idTrajet: id });

    // 2- Calculer le nombre de places restantes
    const nbrPlacesReservees = reservations.reduce((sum, res) => sum + res.nbrPlacesReservees, 0);
    const placesRestantes = trajet.placesDispo - nbrPlacesReservees;

    // Vérification si le nombre de places disponibles mis à jour est inférieur à 0 ou dépasse le nombre de réservations existantes
    if (updatedData.placesDispo < nbrPlacesReservees||updatedData.placesDispo < 0) {
      return res.status(400).json({ message: 'Nombre de places invalides.' });
    }

    // Vérification des modifications interdites si des réservations existent
    const restrictedFields = ['prix', 'placesDispo', 'heureDepart', 'destination', 'depart'];
    if (reservations.length > 0 && restrictedFields.some(field => updatedData[field] !== undefined && updatedData[field] !== trajet[field])) {
      return res.status(400).json({ message: 'Impossible de modifier certaines informations car des réservations existent.' });
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
    const updatedTrajet = await Trajet.findByIdAndUpdate(id, updatedData, { new: true });

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
      res.status(404).json({ message: 'Trajet not found' });
    }

    // TODO : Si trajet a des reservations : annuler les reservation, informer les users

    // Recuperer le trajet et l'envoyer a check if is authorized avant de le supprimer
    checkIfIsAuthorized(req, trajet, res);

    res.status(200).json(trajet); // Non
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkIfIsAuthorized = (req, trajet, res) => {
  if (!req.user || trajet.idConducteur.toString() != req.user._id.toString()) {
    res
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
    const trajets = await Trajet.find({ _id: { $in: reservations.map(res => res.idTrajet) } });
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all tragets by conducteur
exports.getTrajetsByConducteur = async (req, res) => {
  try {
    const id = req.params.id;
    const trajets = await Trajet.find
    ({ idConducteur: id });
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.filterTrajets = async (req, res) => {
  try {

    console.log('Requête reçue avec paramètres:', req.query);

    // Récupération des critères de filtrage depuis les paramètres de la requête
    const {  pointArriveeDescription,pointDepartDescription, fumeur, animaux, filleUniquement, placesDispo } = req.query;

    // Vérification de la présence du point d'arrivée (obligatoire)
    if (!pointArriveeDescription) {
      return res.status(400).json({ message: "La description du point d'arrivée est obligatoire." });
    }

    // Construction dynamique de la requête de filtrage
    const filtre = { 'pointArrivee.description': pointArriveeDescription };

    if (pointDepartDescription) {
      filtre['pointDepart.description'] = pointDepartDescription;
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

    // Exécution de la requête avec les filtres construits
    const trajets = await Trajet.find(filtre);

    // Retour des trajets filtrés
    res.status(200).json(trajets);
  } catch (err) {
    // Gestion des erreurs
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
