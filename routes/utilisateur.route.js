const express = require('express');
const router = express.Router();
const UtilisateurController= require('../controllers/utilisateur.controller');

router.get('/', UtilisateurController.getUtilisateurs);
router.get('/:id', UtilisateurController.getUtilisateurById);
router.put('/:id', UtilisateurController.updateUtilisateur);
router.delete('/:id', UtilisateurController.deleteUtilisateur);
router.post('/register',UtilisateurController.registerUtilisateur);
router.post('/login',UtilisateurController.loginUser);


module.exports = router;