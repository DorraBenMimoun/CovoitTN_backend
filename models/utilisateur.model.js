const mongoose = require('mongoose');
const utilisateurSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: (props) => `${props.value} n'est pas un email valide !`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateNaissance: {
      type: Date,
      required: true,
    },
    sexe: {
      type: String,
      required: true,
      enum: ['Homme','Femme'],
    },
    photo: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: false,
    },
    pieceIdentite: {
      type: String,
      required: false,
    },
    permis: {
      type: String,
      required: false,
    },
    dateFinBannissement: {
      type: Date,
      required: false,
    },
    compteActif: {
      type: Boolean,
      required: true,
      default: false,
    },
    statusVerfier:
    {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);
const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
