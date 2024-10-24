const mongoose = require('mongoose');
const trajetSchema = mongoose.Schema({
  idConducteur: {
    type: String,
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
  marqueVoiture: {
    type: String,
    required: true,
  },
  couleurVoiture: {
    type: String,
    required: true,
  },
  datePublication: {
    type: Date,
    required: true,
    default: Date.now,
  },
  pointDepart: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  },
  pointArrivee: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  },
});
const Trajet = mongoose.model('Trajet', trajetSchema);
module.exports = Trajet;
