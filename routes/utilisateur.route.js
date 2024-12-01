const express = require('express');
const router = express.Router();
const UtilisateurController = require('../controllers/utilisateur.controller');
const { authentification } = require('../middelware/auth_middelware.js');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Routes liées aux utilisateurs
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Enregistrer un nouvel utilisateur
 *     description: Crée un nouvel utilisateur dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *               sexe:
 *                 type: string
 *                 enum: [Homme, Femme]
 *               photo:
 *                 type: string
 *                 format: uri
 *               description:
 *                 type: string
 *               pieceIdentite:
 *                 type: string
 *               permis:
 *                 type: string
 *               
 *              
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - password
 *               - phone
 *               - dateNaissance
 *               - sexe
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', UtilisateurController.registerUtilisateur);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Connexion d'un utilisateur
 *     description: Authentifie un utilisateur avec son email et son mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Échec de la connexion (mauvais email ou mot de passe)
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', UtilisateurController.loginUser);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags: [Users]
 *     summary: Déconnexion d'un utilisateur
 *     description: Déconnecte l'utilisateur actuel.
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       500:
 *         description: Erreur serveur
 */
router.get('/logout', UtilisateurController.logout);
/**
 * @swagger
 * /users/exist/{email}:
 *   get:
 *     tags: [Users]
 *     summary: Vérifier si un email existe
 *     description: Vérifier si un email existe
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Email de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email existe
 *       404:
 *         description: Email n'existe pas
 *       500:
 *         description: Erreur serveur
 */
router.get('/exist/:email', UtilisateurController.existEmail);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer tous les utilisateurs
 *     description: Renvoie une liste de tous les utilisateurs.
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       500:
 *         description: Erreur serveur
 */
router.get('/', UtilisateurController.getUtilisateurs);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer un utilisateur par ID
 *     description: Renvoie les détails d'un utilisateur spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id([a-f0-9]{24})', UtilisateurController.getUtilisateurById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Mettre à jour un utilisateur
 *     description: Met à jour les informations d'un utilisateur spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *               sexe:
 *                 type: string
 *                 enum: [Homme, Femme]
 *               photo:
 *                 type: string
 *                 format: uri
 *               description:
 *                 type: string
 *               pieceIdentite:
 *                 type: string
 *               permis:
 *                 type: string
 *               statusVerfier:
 *                 type: boolean
 *               dateFinBannissement:
 *                 type: string
 *                 format: date-time
 *               compteActif:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
  '/:id([a-f0-9]{24})',
  authentification,
  UtilisateurController.updateUtilisateur,
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete(
  '/:id([a-f0-9]{24})',
  authentification,
  UtilisateurController.deleteUtilisateur,
);

module.exports = router;
