const Reservation = require('../models/reservation.model.js'); 
const Trajet = require('../models/trajet.model.js');


// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const { idTrajet, idPassager, nbrPlacesReservees, prixTotal, messagePassager } = req.body;

    // Récupérer le trajet pour vérifier le nombre de places disponibles
    const trajet = await Trajet.findById(idTrajet);

    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }


    // Calculer les places restantes
    const reservations = await Reservation.find({ idTrajet });
    const placesRestantes = trajet.placesDispo - reservations.reduce((sum, res) => sum + res.nbrPlacesReservees, 0);
 
      if( nbrPlacesReservees <= 0){
      return res.status(400).json({ message: 'Le nombre de places réservées doit être supérieur à 0' });
    }

    if (nbrPlacesReservees > placesRestantes) {
      return res.status(400).json({ message: 'Nombre de places demandées supérieur aux places disponibles.' });
    }
  
    

    // Créer la réservation
    const reservation = new Reservation({
      idTrajet,
      idPassager,
      nbrPlacesReservees,
      prixTotal,
      messagePassager,
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une réservation par ID
exports.getReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findById(id)
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo archieved');

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo archieved');

    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const id = req.params.id;

    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all reservations by conducteur
exports.getReservationsByConducteur = async (req, res) => {
  try {
    const idConducteur = req.params.id;
    const trajets = await Trajet.find({ idConducteur });
    const reservations = await Reservation.find({ idTrajet: { $in: trajets.map(trajet => trajet._id) } })
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo archieved');

    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accepter une réservation
exports.acceptReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findById(id).populate('idTrajet');  // Nous populons le trajet pour avoir accès aux informations nécessaires

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier si un passager a réservé le même trajet et a une réservation acceptée
    const otherReservation = await Reservation.findOne({
      idPassager: reservation.idPassager,
      idTrajet: reservation.idTrajet._id,
      etat: 'Acceptée',
      _id: { $ne: id }  // On exclut la réservation actuelle
    });

    if (otherReservation) {
      // Si une réservation acceptée du même passager pour le même trajet existe, on fusionne les réservations
      reservation.nbrPlacesReservees += otherReservation.nbrPlacesReservees;
      reservation.prixTotal += otherReservation.prixTotal;

      // Supprimer la deuxième réservation
      await Reservation.findByIdAndDelete(otherReservation._id);

      // Sauvegarder les modifications de la première réservation
      await reservation.save();

      return res.status(200).json({ message: 'Réservation mise à jour et fusionnée avec la réservation existante', reservation });
    }

    // Si aucune réservation existante à fusionner, accepter la réservation
    reservation.etat = 'Acceptée';
    await reservation.save();

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Refuser une réservation
exports.refuseReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    /*const trajet = await Trajet.findById(reservation.idTrajet);
    
    if(trajet.idConducteur !== req.user.id){
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à annuler cette réservation' });
    }*/

    reservation.etat = 'Refusée';
    await reservation.save();

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Annuler une réservation
exports.cancelReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }


   /* if(reservation.idPassager !== req.user.id){
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à annuler cette réservation' });
    }*/

    reservation.etat = 'Annulée';
    await reservation.save();

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReservationsByPassager = async (req, res) => {
  try {
    const idPassager = req.params.id;

    // Récupérer les réservations du passager
    const reservations = await Reservation.find({ idPassager })
      .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo archieved') // Peupler les détails du trajet
      .lean(); // Utiliser lean pour transformer les documents Mongoose en objets JS simples

    // Ajouter la liste des autres passagers ayant une réservation acceptée sur le même trajet
    for (let reservation of reservations) {
      if (reservation.idTrajet) {
        // Rechercher les autres passagers ayant une réservation acceptée sur le même trajet
        const autresReservations = await Reservation.find({
          idTrajet: reservation.idTrajet._id,
          etat: 'Acceptée',
          idPassager: { $ne: idPassager }, // Exclure le passager actuel
        })
          .populate('idPassager', 'nom prenom email photo') // Peupler les détails des autres passagers
          .select('idPassager etat'); // Sélectionner uniquement les champs nécessaires

        // Ajouter les autres passagers à la réservation actuelle
        reservation.autresPassagers = autresReservations.map(res => res.idPassager);
      }
    }

    res.status(200).json(reservations);
  } catch (err) {
    console.error('Erreur lors de la récupération des réservations:', err);
    res.status(500).json({ message: err.message });
  }
};


//get all reservations by trajet
exports.getReservationsByTrajet = async (req, res) => {
  try {
    const idTrajet = req.params.id;
    const reservations = await Reservation.find({ idTrajet })
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo archieved');

    res.status(200).json(reservations);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}

