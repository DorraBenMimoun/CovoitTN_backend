const express = require('express');
const router = express.Router();
const TrajetController = require('../controllers/trajet.controller');

/**
 * @swagger
 * /trajet/:
 *  
 *   get:
 *     summary: Récupère tous les trajets

 *     responses:
 *       200:
 *         description: Liste des trajets.
 */
router.get('/', TrajetController.getTrajets);

/**
 * @swagger
 * /trajet/{id}:
 *   get:
 *     summary: Récupère un trajet par ID
 *    
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du trajet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails d'un trajet
 *       404:
 *         description: Trajet non trouvé
 */
router.get('/:id', TrajetController.getTrajetById);
/**
 * @swagger
 * /trajet/:
 *   post:
 *     summary: Créer un nouveau trajet
 *  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idConducteur:
 *                 type: string
 *                 description: ID du conducteur
 *                 example: "1234567890"
 *               dateDepart:
 *                 type: string
 *                 format: date
 *                 description: Date de départ du trajet
 *                 example: "2024-10-20"
 *               heureDepart:
 *                 type: string
 *                 description: Heure de départ du trajet
 *                 example: "08:30"
 *               duree:
 *                 type: number
 *                 description: Durée estimée du trajet en minutes
 *                 example: 120
 *               distance:
 *                 type: number
 *                 description: Distance du trajet en kilomètres
 *                 example: 250.5
 *               nombrePlaces:
 *                 type: number
 *                 description: Nombre de places disponibles
 *                 example: 4
 *               prixTrajet:
 *                 type: number
 *                 description: Prix par passager
 *                 example: 15
 *               animaux:
 *                 type: boolean
 *                 description: Autorisation des animaux
 *                 example: false
 *               fumeur:
 *                 type: boolean
 *                 description: Autorisation de fumer
 *                 example: false
 *               filleUniquement:
 *                 type: boolean
 *                 description: Trajet réservé aux femmes uniquement
 *                 example: false
 *               maxPassArriere:
 *                 type: number
 *                 description: Nombre maximum de passagers à l'arrière
 *                 example: 3
 *               marqueVoiture:
 *                 type: string
 *                 description: Marque de la voiture
 *                 example: "Toyota"
 *               couleurVoiture:
 *                 type: string
 *                 description: Couleur de la voiture
 *                 example: "Bleue"
 *               pointDepart:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude du point de départ
 *                     example: 48.8588443
 *                   lng:
 *                     type: number
 *                     description: Longitude du point de départ
 *                     example: 2.2943506
 *               pointArrivee:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude du point d'arrivée
 *                     example: 45.764043
 *                   lng:
 *                     type: number
 *                     description: Longitude du point d'arrivée
 *                     example: 4.835659
 *     responses:
 *       201:
 *         description: Trajet créé avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */

router.post('/', TrajetController.createTrajet);
/**
 * @swagger
 * /trajet/{id}:
 *   put:
 *     summary: Met à jour un trajet par ID
 *     
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du trajet
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idConducteur:
 *                 type: string
 *                 description: ID du conducteur
 *                 example: "1234567890"
 *               dateDepart:
 *                 type: string
 *                 format: date
 *                 description: Date de départ du trajet
 *                 example: "2024-10-20"
 *               heureDepart:
 *                 type: string
 *                 description: Heure de départ du trajet
 *                 example: "08:30"
 *               duree:
 *                 type: number
 *                 description: Durée estimée du trajet en minutes
 *                 example: 120
 *               distance:
 *                 type: number
 *                 description: Distance du trajet en kilomètres
 *                 example: 250.5
 *               nombrePlaces:
 *                 type: number
 *                 description: Nombre de places disponibles
 *                 example: 4
 *               prixTrajet:
 *                 type: number
 *                 description: Prix par passager
 *                 example: 15
 *               animaux:
 *                 type: boolean
 *                 description: Autorisation des animaux
 *                 example: false
 *               fumeur:
 *                 type: boolean
 *                 description: Autorisation de fumer
 *                 example: false
 *               filleUniquement:
 *                 type: boolean
 *                 description: Trajet réservé aux femmes uniquement
 *                 example: false
 *               maxPassArriere:
 *                 type: number
 *                 description: Nombre maximum de passagers à l'arrière
 *                 example: 3
 *               marqueVoiture:
 *                 type: string
 *                 description: Marque de la voiture
 *                 example: "Toyota"
 *               couleurVoiture:
 *                 type: string
 *                 description: Couleur de la voiture
 *                 example: "Bleue"
 *               pointDepart:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude du point de départ
 *                     example: 48.8588443
 *                   lng:
 *                     type: number
 *                     description: Longitude du point de départ
 *                     example: 2.2943506
 *               pointArrivee:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude du point d'arrivée
 *                     example: 45.764043
 *                   lng:
 *                     type: number
 *                     description: Longitude du point d'arrivée
 *                     example: 4.835659
 *     responses:
 *       200:
 *         description: Trajet mis à jour avec succès
 *       404:
 *         description: Trajet non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

router.put('/:id', TrajetController.updateTrajet);
/**
 * @swagger
 * /trajet/{id}:
 *   delete:
 *     summary: Supprime un trajet par ID
 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du trajet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trajet supprimé avec succès
 *       404:
 *         description: Trajet non trouvé
 */
router.delete('/:id', TrajetController.deleteTrajet);
/**
 * @swagger
 * /trajet/trajetsByConducteur/{id}:
 *   get:
 *     summary: Récupère les trajets par ID du conducteur
 *     
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du conducteur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des trajets pour le conducteur spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID du trajet
 *                   idConducteur:
 *                     type: string
 *                     description: ID du conducteur
 *                   dateDepart:
 *                     type: string
 *                     format: date
 *                     description: Date de départ du trajet
 *                   heureDepart:
 *                     type: string
 *                     description: Heure de départ du trajet
 *                   duree:
 *                     type: number
 *                     description: Durée estimée du trajet en minutes
 *                   distance:
 *                     type: number
 *                     description: Distance du trajet en kilomètres
 *                   nombrePlaces:
 *                     type: number
 *                     description: Nombre de places disponibles
 *                   prixTrajet:
 *                     type: number
 *                     description: Prix par passager
 *                   animaux:
 *                     type: boolean
 *                     description: Autorisation des animaux
 *                   fumeur:
 *                     type: boolean
 *                     description: Autorisation de fumer
 *                   filleUniquement:
 *                     type: boolean
 *                     description: Trajet réservé aux femmes uniquement
 *                   maxPassArriere:
 *                     type: number
 *                     description: Nombre maximum de passagers à l'arrière
 *                   marqueVoiture:
 *                     type: string
 *                     description: Marque de la voiture
 *                   couleurVoiture:
 *                     type: string
 *                     description: Couleur de la voiture
 *                   pointDepart:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                         description: Latitude du point de départ
 *                       lng:
 *                         type: number
 *                         description: Longitude du point de départ
 *                   pointArrivee:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                         description: Latitude du point d'arrivée
 *                       lng:
 *                         type: number
 *                         description: Longitude du point d'arrivée
 *       404:
 *         description: Aucun trajet trouvé pour le conducteur
 *       500:
 *         description: Erreur interne du serveur
 */

router.get('/trajetsByConducteur/:id', TrajetController.getTrajetsByConducteur);
router.post('/trajetsByPointDepart', TrajetController.getTrajetsByPointDepart);
router.post('/trajetsByPointArrivee', TrajetController.getTrajetsByPointArrivee);
router.get('/trajetsByPointDepartArrivee', TrajetController.getTrajetsByPointDepartArrivee);
/**
 * @swagger
 * /trajet/estimation/PrixMaxMin:
 *   get:
 *     summary: Estime le prix maximum d'un trajet basé sur le prix de l'essence, la distance, et la durée
 *     tags:
 *       - Trajets
 *     parameters:
 *       - in: query
 *         name: prixEssence
 *         required: true
 *         description: Prix du kilomètre d'essence en euros
 *         schema:
 *           type: number
 *           example: 0.1
 *       - in: query
 *         name: distance
 *         required: true
 *         description: Distance du trajet en kilomètres
 *         schema:
 *           type: number
 *           example: 250
 *       - in: query
 *         name: duree
 *         required: true
 *         description: Durée du trajet en heures
 *         schema:
 *           type: number
 *           example: 3
 *     responses:
 *       200:
 *         description: Prix estimé pour le trajet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prixEstime:
 *                   type: number
 *                   description: Prix estimé en euros
 *                   example: 25.0
 */
router.get('/estimation/PrixMaxMin', TrajetController.getEstimationPrix);

module.exports = router;
