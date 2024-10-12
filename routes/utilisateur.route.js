const express = require('express');
const router = express.Router();
const UtilisateurController= require('../controllers/utilisateur.controller');

router.get('/', UtilisateurController.getUtilisateurs);
router.get('/:id', UtilisateurController.getUtilisateurById);
router.post('/', UtilisateurController.createUtilisateur);
router.put('/:id', UtilisateurController.updateUtilisateur);
router.delete('/:id', UtilisateurController.deleteUtilisateur);

module.exports = router;