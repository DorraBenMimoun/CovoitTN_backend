const mongoose = require('mongoose');

const reclamationSchema = new mongoose.Schema(
  {
    // L'utilisateur qui fait la réclamation
    utilisateurReclamant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true,
    },
    // L'utilisateur contre lequel la réclamation est faite
    utilisateurReclame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true,
    },
    // La raison de la réclamation
    raison: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500,
    },
    // L'état de la réclamation (enum)
    etat: {
      type: String,
      enum: ['En cours', 'Traitée', 'Rejetée'],
      default: 'En cours',
    },
    // Date de traitement de la réclamation
    dateTraitement: {
      type: Date,
    },
    // Réponse donnée par l'administrateur
    reponse: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true } // Ajoute automatiquement les champs createdAt et updatedAt
);

const Reclamation = mongoose.model('Reclamation', reclamationSchema);

module.exports = Reclamation;
