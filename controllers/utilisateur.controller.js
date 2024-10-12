const Utilisateur = require('../models/utilisateur.model');

const getUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find();
        res.status(200).json(utilisateurs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const getUtilisateurById = async (req, res) => {
    try {
        const id = req.params.id;
        const utilisateur = await Utilisateur.findById(id);
        res.status(200).json(utilisateur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const createUtilisateur = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.create(req.body);
        res.status(200).json(utilisateur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const updateUtilisateur = async (req, res) => {
    try {
        const id = req.params.id;
        const utilisateur = await Utilisateur.findByIdAndUpdate
        (id, req.body, { new: true });
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur not found' });
        }
        const updatedUtilisateur = await Utilisateur.findById(id);
        res.status(200).json(updatedUtilisateur);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const deleteUtilisateur = async (req, res) => {
    try {
        const id = req.params.id;
        const utilisateur = await Utilisateur.findByIdAndDelete(id);
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur not found' });
        }
        res.status(200).json(utilisateur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = {
    getUtilisateurs,
    getUtilisateurById,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur
}
