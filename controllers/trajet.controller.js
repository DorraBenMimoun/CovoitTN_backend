const Trajet = require('../models/trajet.model.js');
const Reservation = require('../models/reservation.model.js');

// Create and Save a new Trajet
exports.createTrajet = async (req, res) => {
  try {
    const idUser = req.user._id;

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
    const trajet = new Trajet({
      idConducteur: idUser,
      pointDepart: pointDepart,
      pointArrivee: pointArrivee,
      dateDepart: req.body.dateDepart,
      heureDepart: req.body.heureDepart,
      placesDispo: req.body.placesDispo,
      prixTrajet: req.body.prixTrajet,
      distance: req.body.distance,
      duree: req.body.duree,
      fumeur: req.body.fumeur,
      animaux: req.body.animaux,
      filleUniquement: req.body.filleUniquement,
      maxPassagersArriere: req.body.maxPassagersArriere,
    });
    await trajet.save();
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
      'nom prenom email photo sexe compteActif phone ',
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
exports.updateTrajet = async (req, res) => {
  try {
    const id = req.params.id;
    const idUser = req.user._id;

    const updatedData = req.body;

    // Récupérer le trajet actuel
    const trajet = await Trajet.findById(id);

    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé.' });
    }
    if (trajet.idConducteur.toString() !== idUser.toString()) {
      return res
        .status(401)
        .json({ message: 'Ce trajet ne vous appartient pas' });
    }

    // Récupérer les réservations associées à ce trajet
    const reservations = await Reservation.find({
      idTrajet: id,
      etat: 'Acceptée',
    });

    // Calculer le nombre de places déjà réservées
    const nbrPlacesReservees = reservations.reduce(
      (sum, res) => sum + res.nbrPlacesReservees,
      0,
    );

    // Définir les champs autorisés à être mis à jour
    const allowedFields = [
      'prixTrajet',
      'placesDispo',
      'heureDepart',
      'destination',
      'depart',
      'fumeur',
      'animaux',
      'filleUniquement',
      'maxPassagersArriere',
    ];

    // Définir les champs restreints si des réservations existent
    const restrictedFields = [
      'heureDepart',
      'destination',
      'depart',
      'prixTrajet',
    ];

    // Parcourir les champs mis à jour et appliquer les validations
    Object.keys(updatedData).forEach((field) => {
      if (!allowedFields.includes(field)) {
        // Rejeter les champs non autorisés
        delete updatedData[field];
      } else {
        // Validation pour "placesDispo"
        if (field === 'placesDispo') {
          if (
            updatedData.placesDispo < nbrPlacesReservees ||
            updatedData.placesDispo < 0
          ) {
            throw new Error('Nombre de places invalides.');
          }
        }

        // Validation pour "prixTrajet"
        if (field === 'prixTrajet' && updatedData.prixTrajet < 0) {
          throw new Error('Prix invalide.');
        }

        // Vérification des champs restreints
        if (
          reservations.length > 0 &&
          restrictedFields.includes(field) &&
          updatedData[field] !== trajet[field]
        ) {
          throw new Error(
            `Impossible de modifier ${field} car des réservations existent.`,
          );
        }

        // Appliquer la mise à jour
        trajet[field] = updatedData[field];
      }
    });

    // Sauvegarder le trajet mis à jour
    await trajet.save();

    return res.status(200).json(trajet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Trajet or archive it if there are reservations
exports.deleteTrajet = async (req, res) => {
  try {
    const id = req.params.id;

    // Trouver le trajet par son ID
    const trajet = await Trajet.findById(id);

    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    if (trajet.idConducteur.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'You are not authorized to do this action' });
    }

    // Vérifier si des réservations existent pour ce trajet
    const reservations = await Reservation.find({ idTrajet: trajet._id });

    if (reservations.length > 0) {
      console.log('trajet avant archive', trajet);
      // Si des réservations existent, on archive le trajet et on annule les réservations
      trajet.archieved = true;

      console.log('Trajet archivé:', trajet.archived);
      await trajet.save(); // Sauvegarder le trajet avec l'attribut 'archived' mis à jour
      console.log('trajet aprs archive', trajet);

      // Annuler toutes les réservations associées au trajet
      for (let i = 0; i < reservations.length; i++) {
        reservations[i].etat = 'Annulée'; // Modifier l'état des réservations à 'Annulée'
        await reservations[i].save();
      }

      return res
        .status(200)
        .json({ message: 'Trajet archivé et réservations annulées', trajet });
    } else {
      // Si aucune réservation n'existe, supprimer le trajet
      await Trajet.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Trajet supprimé avec succès' });
    }
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

function createRegexForTerm(term) {
  if (!term) return null;

  // Crée une expression régulière insensible à la casse
  const regex = new RegExp(term.replace(/[^\w\s]/g, ''), 'i'); // 'i' pour insensible à la casse

  return regex;
}

exports.filterTrajets = async (req, res) => {
  try {
    console.log('Requête reçue avec paramètres:', req.query);

    const {
      pointArrivee,
      pointDepart,
      fumeur,
      animaux,
      filleUniquement,
      placesDispo,
      date,
    } = req.query;

    // Vérifier que le point d'arrivée est fourni
    if (!pointArrivee) {
      return res
        .status(400)
        .json({ message: "Le point d'arrivée est obligatoire." });
    }

    // Expression régulière pour la recherche dans les descriptions ou les termes
    const regexPointArrivee = new RegExp(
      pointArrivee.replace(/[^\w\s]/g, ''),
      'i',
    );
    const regexPointDepart = pointDepart
      ? new RegExp(pointDepart.replace(/[^\w\s]/g, ''), 'i')
      : null;

    // Construction des filtres
    const filtre = {
      $and: [
        {
          $or: [
            { 'pointArrivee.description': { $regex: regexPointArrivee } },
            {
              'pointArrivee.terms': {
                $elemMatch: { value: { $regex: regexPointArrivee } },
              },
            },
          ],
        },
      ],
    };

    // Ajouter le filtre pour le point de départ si spécifié
    if (pointDepart) {
      filtre.$and.push({
        $or: [
          { 'pointDepart.description': { $regex: regexPointDepart } },
          {
            'pointDepart.terms': {
              $elemMatch: { value: { $regex: regexPointDepart } },
            },
          },
        ],
      });
    }

    // Ajout du filtre de date
    const currentDate = new Date();
    if (date) {
      // Convertir la date de la requête en début et fin de journée
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0); // Début de la journée
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999); // Fin de la journée

      filtre.$and.push({ dateDepart: { $gte: startOfDay, $lte: endOfDay } });
    } else {
      filtre.$and.push({ dateDepart: { $gte: currentDate } }); // Recherche des trajets futurs
    }

    // Ajout des autres critères de filtrage
    if (fumeur !== undefined) {
      filtre.$and.push({ fumeur: fumeur === 'true' });
    }
    if (animaux !== undefined) {
      filtre.$and.push({ animaux: animaux === 'true' });
    }
    if (filleUniquement !== undefined) {
      filtre.$and.push({ filleUniquement: filleUniquement === 'true' });
    }
    if (placesDispo) {
      filtre.$and.push({ placesDispo: { $gte: Number(placesDispo) } });
    }

    console.log('Filtres utilisés:', JSON.stringify(filtre, null, 2));

    // Exécution de la requête avec les filtres
    const trajets = await Trajet.find(filtre).populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );

    res.status(200).json(trajets);
  } catch (err) {
    console.error('Erreur lors du filtrage des trajets:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.quickSearch = async (req, res) => {
  try {
    console.log('Requête reçue avec paramètre de recherche:', req.query);

    const { text } = req.query;

    // Vérification que le paramètre de recherche est présent
    if (!text) {
      return res
        .status(400)
        .json({ message: 'Le texte de recherche est obligatoire.' });
    }

    const regexText = new RegExp(text, 'i'); // Expression régulière insensible à la casse

    // Recherche initiale dans les descriptions
    const trajets = await Trajet.find({
      $or: [
        { 'pointDepart.description': regexText },
        { 'pointArrivee.description': regexText },
      ],
    }).populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );

    // Si des trajets sont trouvés dans les descriptions, extraire les descriptions correspondantes
    if (trajets.length > 0) {
      const uniqueDescriptions = [
        ...new Set(
          trajets.flatMap((trajet) => [
            trajet.pointDepart.description,
            trajet.pointArrivee.description,
          ]),
        ),
      ];
      return res.status(200).json(uniqueDescriptions);
    }

    // Si aucune correspondance n'est trouvée dans les descriptions, chercher dans les termes
    const trajetsByTerms = await Trajet.find({
      $or: [
        { 'pointDepart.terms': { $elemMatch: { value: regexText } } },
        { 'pointArrivee.terms': { $elemMatch: { value: regexText } } },
      ],
    }).populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );

    // Extraire les termes uniques correspondants
    const uniqueTerms = [
      ...new Set(
        trajetsByTerms.flatMap(
          (trajet) =>
            [
              ...(trajet.pointDepart.terms || []).map((term) => term.value),
              ...(trajet.pointArrivee.terms || []).map((term) => term.value),
            ].filter((value) => regexText.test(value)), // Filtrer les termes correspondant au texte
        ),
      ),
    ];

    // Retourner le tableau de résultats uniques (descriptions ou termes)
    res.status(200).json(uniqueTerms);
  } catch (err) {
    console.error('Erreur lors de la recherche rapide:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTrajetsBySamePoints = async (req, res) => {
  try {
    const { pointDepart, pointArrivee } = req.body;

    if (!pointDepart || !pointArrivee) {
      return res
        .status(400)
        .json({ message: "Les points de départ et d'arrivée sont requis." });
    }

    console.log('Recherche des trajets avec les mêmes points:', {
      pointDepart,
      pointArrivee,
    });

    // Étape 1 : Recherche avec la description exacte
    let trajets = await Trajet.find({
      'pointDepart.description': pointDepart.description,
      'pointArrivee.description': pointArrivee.description,
    }).populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );

    // Si des trajets correspondants sont trouvés, on les retourne immédiatement
    if (trajets.length > 0) {
      return res.status(200).json(trajets);
    }

    console.log(
      'Aucun trajet trouvé avec les descriptions exactes, recherche avec les avant-derniers termes...',
    );

    // Étape 2 : Recherche avec les avant-derniers termes
    const avantDernierTermDepart =
      pointDepart.terms[pointDepart.terms.length - 2]?.value;
    const avantDernierTermArrivee =
      pointArrivee.terms[pointArrivee.terms.length - 2]?.value;

    if (!avantDernierTermDepart || !avantDernierTermArrivee) {
      return res.status(400).json({
        message: 'Les avant-derniers termes des points sont manquants.',
      });
    }

    trajets = await Trajet.find().populate(
      'idConducteur',
      'nom prenom email photo sexe compteActif phone',
    );

    // Filtrage des trajets sur les avant-derniers termes
    const filteredTrajets = trajets.filter((trajet) => {
      const trajetDepartTerms = trajet.pointDepart.terms;
      const trajetArriveeTerms = trajet.pointArrivee.terms;

      const trajetAvantDernierDepart =
        trajetDepartTerms[trajetDepartTerms.length - 2]?.value;
      const trajetAvantDernierArrivee =
        trajetArriveeTerms[trajetArriveeTerms.length - 2]?.value;

      return (
        trajetAvantDernierDepart === avantDernierTermDepart &&
        trajetAvantDernierArrivee === avantDernierTermArrivee
      );
    });

    // Retourner les trajets filtrés
    res.status(200).json(filteredTrajets);
  } catch (err) {
    console.error('Erreur lors de la recherche des trajets:', err);
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
