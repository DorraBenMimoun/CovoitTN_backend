const express = require('express');
const feedbackController = require('../controllers/feedback.controller');

const router = express.Router();

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     tags:
 *       - Feedbacks
 *     summary: Créer un nouveau feedback
 *     description: Permet à un passager de laisser un feedback sur un trajet.
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
 *                 example: "670c2158672df91a588aa334"
 *               idPassager:
 *                 type: string
 *                 description: ID du passager ayant laissé le feedback
 *                 example: "639c5b8b8f1d2c24bc12e789"
 *               note:
 *                 type: integer
 *                 description: Note donnée au trajet (1-5)
 *                 example: 4
 *               description:
 *                 type: string
 *                 description: Description optionnelle du feedback
 *                 example: "Très bon trajet."
 *     responses:
 *       201:
 *         description: Feedback créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', feedbackController.createFeedback);

/**
 * @swagger
 * /feedbacks:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Récupérer tous les feedbacks
 *     description: Retourne une liste de tous les feedbacks existants.
 *     responses:
 *       200:
 *         description: Liste des feedbacks récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', feedbackController.getAllFeedbacks);

/**
 * @swagger
 * /feedbacks/{id}:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Récupérer un feedback par ID
 *     description: Retourne les détails d'un feedback spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du feedback
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', feedbackController.getFeedbackById);

/**
 * @swagger
 * /feedbacks/trajet/{id}:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Récupérer les feedbacks d'un trajet
 *     description: Retourne une liste de feedbacks liés à un trajet spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du trajet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des feedbacks récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Trajet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/trajet/:id', feedbackController.getFeedbacksByTrajet);

/**
 * @swagger
 * /feedbacks/{id}:
 *   delete:
 *     tags:
 *       - Feedbacks
 *     summary: Supprimer un feedback
 *     description: Supprime un feedback spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du feedback
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback supprimé avec succès
 *       404:
 *         description: Feedback non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', feedbackController.deleteFeedback);

/**
 * @swagger
 * /feedbacks/passager/{id}:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Récupérer les feedbacks d'un passager
 *     description: Retourne une liste de feedbacks laissés par un passager spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du passager
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des feedbacks récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Passager non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/passager/:id', feedbackController.getFeedbacksByPassager);

/**
 * @swagger
 * /feedbacks/conducteur/{id}:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Récupérer les feedbacks d'un conducteur
 *     description: Retourne une liste de feedbacks liés aux trajets d'un conducteur spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du conducteur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des feedbacks récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Conducteur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/conducteur/:id', feedbackController.getFeedbacksByConducteur);

/**
 * @swagger
 * /feedbacks/moyenne/{id}:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Récupérer la moyenne des notes d'un conducteur
 *     description: Calcule et retourne la moyenne des notes pour un conducteur.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du conducteur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Moyenne des notes calculée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageNote:
 *                   type: number
 *                   description: Moyenne des notes
 *                   example: 4.5
 *       404:
 *         description: Conducteur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/moyenne/:id', feedbackController.getAverageNoteByConducteur);


/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *        - idTrajet
 *        - idPassager
 *        - note
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du feedback
 *         idTrajet:
 *           type: string
 *           description: ID du trajet concerné
 *         idPassager:
 *           type: string
 *           description: ID du passager ayant laissé le feedback
 *         note:
 *           type: integer
 *           description: Note donnée au trajet (1-5)
 *         description:
 *           type: string
 *           description: Description optionnelle du feedback
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 */

module.exports = router;
