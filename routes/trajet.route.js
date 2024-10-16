const express = require('express');
const router = express.Router();
const TrajetController = require('../controllers/trajet.controller');

router.get('/', TrajetController.getTrajets);
router.get('/:id', TrajetController.getTrajetById);
router.post('/', TrajetController.createTrajet);
router.put('/:id', TrajetController.updateTrajet);
router.delete('/:id', TrajetController.deleteTrajet);
router.get('/trajetsByConducteur/:id', TrajetController.getTrajetsByConducteur);
router.post('/trajetsByPointDepart', TrajetController.getTrajetsByPointDepart);
router.post('/trajetsByPointArrivee', TrajetController.getTrajetsByPointArrivee);
router.get('/trajetsByPointDepartArrivee', TrajetController.getTrajetsByPointDepartArrivee);

module.exports = router;
