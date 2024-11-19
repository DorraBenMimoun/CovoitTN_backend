const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');

// Créer une nouvelle réservation
router.post('/', reservationController.createReservation);

// Récupérer toutes les réservations
router.get('/', reservationController.getAllReservations);

// Récupérer une réservation spécifique par ID
router.get('/:id', reservationController.getReservation);



// Supprimer une réservation spécifique par ID
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
