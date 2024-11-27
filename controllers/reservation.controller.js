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
    const reservation = await Reservation.findById(id);

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
    const reservations = await Reservation.find();
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
    const reservations = await Reservation.find({ idTrajet: { $in: trajets.map(trajet => trajet._id) } });
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accepter une réservation
exports.acceptReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

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

    reservation.etat = 'Annulée';
    await reservation.save();

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all reservations by passager
exports.getReservationsByPassager = async (req, res) => {
  try {
    const idPassager = req.params.id;
    const reservations = await Reservation.find({ idPassager });
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all reservations by trajet
exports.getReservationsByTrajet = async (req, res) => {
  try {
    const idTrajet = req.params.id;
    const reservations = await Reservation.find({ idTrajet });
    res.status(200).json(reservations);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}

