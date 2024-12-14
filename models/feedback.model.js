const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = mongoose.Schema(
  {
    idTrajet: {
      type: Schema.Types.ObjectId,
      ref: 'Trajet', // Référence au modèle Trajet
      required: true,
    },
    idPassager: {
      type: Schema.Types.ObjectId,
      ref: 'Utilisateur', // Référence au modèle Utilisateur
      required: true,
    },
    note: {
      type: Number,
      required: true,
      min: 1, // Note minimale (par exemple 1)
      max: 5, // Note maximale (par exemple 5)
    },
    description: {
      type: String,
      trim: true, // Supprime les espaces inutiles
    },
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt
  }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);
