const express = require('express');
const router = express.Router();
const UtilisateurController= require('../controllers/utilisateur.controller');

const { authentification } = require("../middelware/auth_middelware.js");

router.post('/register',UtilisateurController.registerUtilisateur);
router.post('/login',UtilisateurController.loginUser);


router.get('/',authentification, UtilisateurController.getUtilisateurs);
router.get('/:id', authentification,UtilisateurController.getUtilisateurById);
router.put('/:id',authentification, UtilisateurController.updateUtilisateur);
router.delete('/:id', authentification,UtilisateurController.deleteUtilisateur);



module.exports = router;