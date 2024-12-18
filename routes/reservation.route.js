const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { authentification } = require('../middelware/auth_middelware');

/**
 * @swagger
 * tags:
 *   name: Réservations
 *   description: Gestion des réservations
 */


// Créer une nouvelle réservation
/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags:
 *       - Réservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idTrajet:
 *                 type: string
 *                 description: ID du trajet concerné
 *                 example: "648a123456abcdef12345678"
 *               idPassager:
 *                 type: string
 *                 description: ID du passager
 *                 example: "123a123456abcdef12345678"
 *               nbrPlacesReservees:
 *                 type: number
 *                 description: Nombre de places réservées
 *                 example: 2
 *               prixTotal:
 *                 type: number
 *                 description: Prix total de la réservation
 *                 example: 50
 *               messagePassager:
 *                 type: string
 *                 description: Message facultatif du passager
 *                 example: "Merci de m'accepter rapidement"
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Erreur de validation ou problème lié aux places disponibles
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', reservationController.createReservation);

// Récupérer une réservation spécifique par ID
/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Récupérer une réservation par ID
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', reservationController.getReservation);

// Récupérer toutes les réservations
/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags:
 *       - Réservations
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', reservationController.getAllReservations);

// Supprimer une réservation spécifique par ID
/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation par ID
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', reservationController.deleteReservation);

// Récupérer toutes les réservations d'un conducteur
/**
 * @swagger
 * /reservations/conducteur/{id}:
 *   get:
 *     summary: Récupérer toutes les réservations d'un conducteur
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du conducteur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations du conducteur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Aucune réservation trouvée pour ce conducteur
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/conducteur/:id', reservationController.getReservationsByConducteur);

/**
 * @swagger
 * /reservations/trajet/{id}:
 *   get:
 *     summary: Récupérer toutes les réservations d'un trajet
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du trajet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations du trajet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'  
 *       404:
 *         description: Aucune réservation trouvée pour ce trajet
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/trajet/:id', reservationController.getReservationsByTrajet);

/**
 * @swagger
 * /reservations/passager/{id}:
 *   get:
 *     summary: Récupérer toutes les réservations d'un passager
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du passager
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations du passager
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Aucune réservation trouvée pour ce passager
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/passager/:id', reservationController.getReservationsByPassager);


//accepter une reservation
/**
 * @swagger
 * /reservations/{id}/accepter:
 *   put:
 *     summary: Accepter une réservation et fusionner avec une réservation existante si nécessaire
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation à accepter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation acceptée avec succès et fusionnée si applicable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de confirmation de l'acceptation et de la fusion
 *                 reservation:
 *                   $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id/accepter', reservationController.acceptReservation);

//refuser une reservation
/**
 * @swagger
 * /reservations/{id}/refuser:
 *   put:
 *     summary: Refuser une réservation
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation à refuser
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation refusée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id/refuser', reservationController.refuseReservation);

//annuler une reservation
/**
 * @swagger
 * /reservations/{id}/annuler:
 *   put:
 *     summary: Annuler une réservation
 *     tags:
 *       - Réservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation à annuler
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation annulée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id/annuler', reservationController.cancelReservation);


/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *        - idTrajet
 *        - idPassager
 *        - nbrPlacesReservees
 *        - prixTotal
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique de la réservation
 *         idTrajet:
 *           type: string
 *           description: ID du trajet
 *         idPassager:
 *           type: string
 *           description: ID du passager
 *         dateReservation:
 *           type: string
 *           format: date-time
 *           description: Date de création de la réservation
 *         nbrPlacesReservees:
 *           type: number
 *           description: Nombre de places réservées
 *         prixTotal:
 *           type: number
 *           description: Prix total de la réservation
 *         messagePassager:
 *           type: string
 *           description: Message facultatif laissé par le passager
 */


module.exports = router;
