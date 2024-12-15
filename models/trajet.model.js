const mongoose = require('mongoose');
const trajetSchema = mongoose.Schema({
  idConducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
  },

  dateDepart: {
    type: Date,
    required: true,
  },
  heureDepart: {
    type: String,
    required: true,
  },
  duree: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  placesDispo: {
    type: Number,
    required: true,
  },
  prixTrajet: {
    type: Number,
    required: true,
    min: [0, 'Le prix du trajet doit être positif.'],

  },
  animaux: {
    type: Boolean,
    required: false,
  },
  fumeur: {
    type: Boolean,
    required: false,
  },
  filleUniquement: {
    type: Boolean,
    required: false,
  },
  maxPassArriere: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  pointDepart: {
    type: {
      description: { type: String, required: true },
      place_id: { type: String, required: true },
      reference: { type: String, required: true },
      terms: { type: Array, required: true },
    },
    required: true,
  },
  pointArrivee: {
    type: {
      description: { type: String, required: true },
      place_id: { type: String, required: true },
      reference: { type: String, required: true },
      terms: { type: Array, required: true },
    },
    required: true,
  },
  archieved: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const Trajet = mongoose.model('Trajet', trajetSchema);
module.exports = Trajet;
