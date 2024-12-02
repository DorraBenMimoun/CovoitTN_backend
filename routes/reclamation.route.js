const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamation.controller');

/**
 * @swagger
 * tags:
 *   name: Reclamations
 *   description: API pour gérer les réclamations des utilisateurs
 */

/**
 * @swagger
 * /reclamations:
 *   post:
 *     summary: Créer une nouvelle réclamation
 *     tags: [Reclamations]
 *     description: Crée une réclamation signalant un autre utilisateur avec la raison.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utilisateurReclamant:
 *                 type: string
 *                 description: ID de l'utilisateur réclamant
 *               utilisateurReclame:
 *                 type: string
 *                 description: ID de l'utilisateur signalé
 *               raison:
 *                 type: string
 *                 description: Raison de la réclamation
 *                 example: "Comportement inapproprié lors d’un trajet."
 *     responses:
 *       201:
 *         description: Réclamation créée avec succès
 *       404:
 *         description: Utilisateur réclamant ou signalé introuvable
 *       500:
 *         description: Erreur interne
 */
router.post('/', reclamationController.createReclamation);

/**
 * @swagger
 * /reclamations:
 *   get:
 *     summary: Récupérer toutes les réclamations
 *     tags: [Reclamations]
 *     description: Récupère la liste de toutes les réclamations
 *     responses:
 *       200:
 *         description: Liste des réclamations
 *       500:
 *         description: Erreur interne
 */
router.get('/', reclamationController.getAllReclamations);

/**
 * @swagger
 * /reclamations/{id}:
 *   put:
 *     summary: Mettre à jour l'état et la réponse d'une réclamation
 *     tags: [Reclamations]
 *     description: Met à jour l'état et la réponse d'une réclamation existante.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réclamation
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               etat:
 *                 type: string
 *                 description: Nouveau état de la réclamation
 *                 enum: [En cours, Traitée, Rejetée]
 *                 example: "Traitée"
 *               reponse:
 *                 type: string
 *                 description: Réponse donnée par l'administration (nécessaire si l'état est "Traitée")
 *                 example: "L'utilisateur a été averti."
 *     responses:
 *       200:
 *         description: Réclamation mise à jour
 *       400:
 *         description: État invalide
 *       404:
 *         description: Réclamation non trouvée
 *       500:
 *         description: Erreur interne
 */
router.put('/:id', reclamationController.updateReclamation);

/**
 * @swagger
 * /reclamations/{id}:
 *   delete:
 *     summary: Supprimer une réclamation
 *     tags: [Reclamations]
 *     description: Supprime une réclamation par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réclamation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réclamation supprimée avec succès
 *       404:
 *         description: Réclamation non trouvée
 *       500:
 *         description: Erreur interne
 */
router.delete('/:id', reclamationController.deleteReclamation);

/**
 * @swagger
 * /reclamations/{id}/traiter:
 *   put:
 *     summary: Traiter une réclamation
 *     tags: [Reclamations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la réclamation à traiter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reponse:
 *                 type: string
 *                 description: Réponse à la réclamation
 *     responses:
 *       200:
 *         description: Réclamation traitée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reclamation'
 *       400:
 *         description: Réclamation déjà traitée ou rejetée
 *       404:
 *         description: Réclamation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id/traiter', reclamationController.traiterReclamation);

/**
 * @swagger
 * /reclamations/{id}/rejeter:
 *   put:
 *     summary: Rejeter une réclamation
 *     tags: [Reclamations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la réclamation à rejeter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reponse:
 *                 type: string
 *                 description: Réponse pour rejeter la réclamation
 *     responses:
 *       200:
 *         description: Réclamation rejetée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reclamation'
 *       400:
 *         description: Réclamation déjà traitée ou rejetée
 *       404:
 *         description: Réclamation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id/rejeter', reclamationController.rejeterReclamation);

/**
 * @swagger
 * /reclamations/user/{id}:
 *   get:
 *     summary: Trouver les réclamations faites par un utilisateur
 *     tags: [Reclamations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur réclamant
 *     responses:
 *       200:
 *         description: Liste des réclamations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reclamation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/user/:id', reclamationController.getReclamationsByUser);

/**
 * @swagger
 * /reclamations/signalees/{id}:
 *   get:
 *     summary: Trouver les réclamations signalées par un utilisateur
 *     tags: [Reclamations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur signalé
 *     responses:
 *       200:
 *         description: Liste des réclamations signalées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reclamation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/signalees/:id', reclamationController.getReclamationsSignalees);

/**
 * @swagger
 * /reclamations/en-cours:
 *   get:
 *     summary: Trouver toutes les réclamations en cours
 *     tags: [Reclamations]
 *     responses:
 *       200:
 *         description: Liste des réclamations en cours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reclamation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/en-cours', reclamationController.getReclamationsEnCours);

/**
 * @swagger
 * /reclamations/traitees:
 *   get:
 *     summary: Trouver toutes les réclamations traitées
 *     tags: [Reclamations]
 *     responses:
 *       200:
 *         description: Liste des réclamations traitées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reclamation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/traitees', reclamationController.getReclamationsTraitees);

/**
 * @swagger
 * /reclamations/rejetees:
 *   get:
 *     summary: Trouver toutes les réclamations rejetées
 *     tags: [Reclamations]
 *     responses:
 *       200:
 *         description: Liste des réclamations rejetées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reclamation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/rejetees', reclamationController.getReclamationsRejetees);

/**
 * @swagger
 * /reclamations/user/{id}/traitees:
 *   get:
 *     summary: Trouver les réclamations traitées faites par un utilisateur
 *     tags: [Reclamations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur réclamant
 *     responses:
 *       200:
 *         description: Liste des réclamations traitées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reclamation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/user/:id/traitees', reclamationController.getReclamationsTraiteesByUser);

/**
 * @swagger
 * /reclamations/user/{id}/en-cours:
 *   get:
 *     summary: Trouver les réclamations en cours faites par un utilisateur
 *     tags: [Reclamations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur réclamant
 *     responses:
 *       200:
 *         description: Liste des réclamations en cours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reclamation'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/user/:id/en-cours', reclamationController.getReclamationsEnCoursByUser);

/**
 * @swagger
 * /reclamations/{id}:
 *   get:
 *     summary: Récupérer une réclamation spécifique
 *     tags: [Reclamations]
 *     description: Récupère une réclamation par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réclamation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réclamation trouvée
 *       404:
 *         description: Réclamation non trouvée
 *       500:
 *         description: Erreur interne
 */
router.get('/:id', reclamationController.getReclamationById);


/**
 * @swagger
 * components:
 *   schemas:
 *     Reclamation:
 *       type: object
 *       required:
 *        - utilisateurReclamant
 *        - utilisateurReclame
 *        - raison
 *        - etat
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de la réclamation
 *         utilisateurReclamant:
 *           type: string
 *           description: ID de l'utilisateur réclamant
 *         utilisateurReclame:
 *           type: string
 *           description: ID de l'utilisateur signalé
 *         raison:
 *           type: string
 *           description: Raison de la réclamation
 *         etat:
 *           type: string
 *           enum: [En cours, Traitée, Rejetée]
 *           description: État actuel de la réclamation
 *         dateTraitement:
 *           type: string
 *           format: date
 *           description: Date à laquelle la réclamation a été traitée (si applicable)
 *         reponse:
 *           type: string
 *           description: Réponse donnée après traitement de la réclamation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la réclamation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour de la réclamation
 */

module.exports = router;
