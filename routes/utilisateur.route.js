const express = require('express');
const router = express.Router();
const UtilisateurController= require('../controllers/utilisateur.controller');

const { authentification } = require("../middelware/auth_middelware.js");

router.post('/register',UtilisateurController.registerUtilisateur);
router.post('/login',UtilisateurController.loginUser);
router.get('/logout',UtilisateurController.logout);


router.get('/', UtilisateurController.getUtilisateurs);
router.get('/:id([a-f0-9]{24})',UtilisateurController.getUtilisateurById);
router.put('/:id([a-f0-9]{24})',authentification, UtilisateurController.updateUtilisateur);
router.delete('/:id([a-f0-9]{24})', authentification,UtilisateurController.deleteUtilisateur);



//app.get('/user/int/:id(\\d+)' ([a-zA-Z]+)'  ([a-f0-9]{24})



module.exports = router;

