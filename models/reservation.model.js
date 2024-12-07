const mongoose = require('mongoose');
const reservationSchema = mongoose.Schema({
  idTrajet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trajet',
    required: true,
  },
  idPassager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
  },
  dateReservation: {
    type: Date,
    required: true,
    default: Date.now,
  },
  nbrPlacesReservees: {
    type: Number,
    required: true,
  },
  etat: {
    type: String,
    required: true,
    enum: ['En attente', 'Acceptée', 'Refusée','Annulée'],
    default: 'En attente'
  },
  prixTotal: {
    type: Number,
    required: true,
  },
  messagePassager:{
    type: String,
    required: false,
  }
});
module.exports = mongoose.model('Reservation', reservationSchema);