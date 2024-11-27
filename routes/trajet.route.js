const express = require('express');
const router = express.Router();
const TrajetController = require('../controllers/trajet.controller');

/**
 * @swagger
 * tags:
 *   - name: Trajets
 *     description: Routes liées aux trajets
 */


/**
 * @swagger
 * /trajets/:
 *   get:
 *     summary: Récupère tous les trajets
 *     tags:
 *       - Trajets
 *     responses:
 *       200:
 *         description: Liste des trajets.
 */
router.get('/', TrajetController.getTrajets);

/**
 * @swagger
 * /trajets/{id}:
 *   get:
 *     tags:
 *       - Trajets
 *     summary: Récupérer un trajet par ID
 *     description: Récupère les détails d'un trajet spécifique en fonction de son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du trajet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du trajet récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trajet'
 *       404:
 *         description: Trajet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', TrajetController.getTrajetById);

/**
 * @swagger
 * /trajets:
 *   post:
 *     tags:
 *       - Trajets
 *     summary: Créer un nouveau trajet
 *     description: Crée un trajet avec les informations fournies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trajet'
 *     responses:
 *       201:
 *         description: Trajet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trajet'
 *       400:
 *         description: Mauvaise demande
 *       500:
 *         description: Erreur serveur
 */
router.post('/', TrajetController.createTrajet);

/**
 * @swagger
 * /trajets/{id}:
 *   put:
 *     summary: Met à jour un trajet par ID
 *     tags:
 *       - Trajets
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
 *             $ref: '#/components/schemas/Trajet'  
 *     responses:
 *       200:
 *         description: Trajet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trajet'
 *       404:
 *         description: Trajet non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id', TrajetController.updateTrajet);

/**
 * @swagger
 * /trajets/{id}:
 *   delete:
 *     summary: Supprime un trajet par ID
 *     tags:
 *       - Trajets
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
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', TrajetController.deleteTrajet);

/**
 * @swagger
 * /trajets/estimation/PrixMaxMin/{distance}:
 *   get:
 *     summary: Estime le prix maximum d'un trajet basé sur le prix de l'essence, la distance, et la durée
 *     tags:
 *       - Trajets
 *     parameters:
 *       - in: path
 *         name: distance
 *         required: true
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
router.get('/estimation/PrixMaxMin/:distance',TrajetController.getEstimationPrix);

/**
 * @swagger
 * /trajets/filter/Trajets:
 *   get:
 *     summary: Filtre les trajets en fonction du point d'arrivée et d'autres critères optionnels
 *     tags:
 *       - Trajets
 *     parameters:
 *       - in: query
 *         name: pointArriveeDescription
 *         required: true
 *         schema:
 *           type: string
 *         description: Description du point d'arrivée (obligatoire)
 *       - in: query
 *         name: pointDepartDescription
 *         required: false
 *         schema:
 *           type: string
 *         description: Description du point de départ (optionnel)
 *       - in: query
 *         name: fumeur
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Indique si le trajet accepte les fumeurs (optionnel)
 *       - in: query
 *         name: animaux
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Indique si le trajet accepte les animaux (optionnel)
 *       - in: query
 *         name: filleUniquement
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Indique si le trajet est réservé aux femmes uniquement (optionnel)
 *       - in: query
 *         name: placesDispo
 *         required: false
 *         schema:
 *           type: integer
 *         description: Nombre minimum de places disponibles pour le trajet (optionnel)
 *     responses:
 *       200:
 *         description: Liste des trajets correspondant aux critères
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trajet'  
 *       400:
 *         description: La description du point d'arrivée est obligatoire
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/filter/Trajets', TrajetController.filterTrajets);

/**
 * @swagger
 * /trajets/Passager/{id}:
 *   get:
 *     summary: Récupère tous les trajets réservés par un passager
 *     tags:
 *       - Trajets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du passager
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des trajets réservés par le passager
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trajet'  
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 */
router.get('/Passager/:id', TrajetController.getTrajetsByPassager);

/**
 * @swagger
 * /trajets/conducteur/{id}:
 *   get:
 *     summary: Récupérer tous les trajets d'un conducteur
 *     tags:
 *       - Trajets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant unique du conducteur
 *     responses:
 *       200:
 *         description: Liste des trajets du conducteur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trajet'  
 *       404:
 *         description: Aucun trajet trouvé pour le conducteur
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/Conducteur/:id', TrajetController.getTrajetsByConducteur);


/**
 * @swagger
 * components:
 *   schemas:
 *     Trajet:
 *       type: object
 *       required:
 *         - idConducteur
 *         - dateDepart
 *         - heureDepart
 *         - duree
 *         - distance
 *         - placesDispo
 *         - prixTrajet
 *         - pointDepart
 *         - pointArrivee
 *       properties:
 *         idConducteur:
 *           type: string
 *           description: Identifiant unique du conducteur
 *         dateDepart:
 *           type: string
 *           format: date
 *           description: Date du départ du trajet
 *         heureDepart:
 *           type: string
 *           description: Heure du départ du trajet
 *         duree:
 *           type: integer
 *           description: Durée du trajet en minutes
 *         distance:
 *           type: integer
 *           description: Distance du trajet en kilomètres
 *         placesDispo:
 *           type: integer
 *           description: Nombre de places disponibles dans le véhicule
 *         prixTrajet:
 *           type: number
 *           format: float
 *           description: Prix du trajet en euros
 *         animaux:
 *           type: boolean
 *           description: Indicateur si les animaux sont autorisés
 *         fumeur:
 *           type: boolean
 *           description: Indicateur si le conducteur est fumeur
 *         filleUniquement:
 *           type: boolean
 *           description: Indicateur si le trajet est réservé uniquement aux femmes
 *         maxPassArriere:
 *           type: integer
 *           description: Nombre maximum de passagers à l'arrière
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date et heure de création du trajet
 *         pointDepart:
 *           type: object
 *           required:
 *             - description
 *             - place_id
 *             - reference
 *             - terms
 *           properties:
 *             description:
 *               type: string
 *               description: Description du point de départ
 *             place_id:
 *               type: string
 *               description: Identifiant du lieu de départ
 *             reference:
 *               type: string
 *               description: Référence du lieu de départ
 *             terms:
 *               type: array
 *               items:
 *                 type: string
 *               description: Liste des termes associés au point de départ
 *         pointArrivee:
 *           type: object
 *           required:
 *             - description
 *             - place_id
 *             - reference
 *             - terms
 *           properties:
 *             description:
 *               type: string
 *               description: Description du point d'arrivée
 *             place_id:
 *               type: string
 *               description: Identifiant du lieu d'arrivée
 *             reference:
 *               type: string
 *               description: Référence du lieu d'arrivée
 *             terms:
 *               type: array
 *               items:
 *                 type: string
 *               description: Liste des termes associés au point d'arrivée
 */

module.exports = router;
