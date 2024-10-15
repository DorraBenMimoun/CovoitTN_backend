const mongoose = require('mongoose');
const utilisateurSchema = mongoose.Schema({
    nom: { 
        type: String, 
        required: true 
    },
    prenom: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true ,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    telephone: { 
        type: String, 
        required: true 
    } ,
    dateNaissance: { 
        type: Date, 
        required: true 
    },
    sexe: { 
        type: String, 
        required: true,
        enum: ['Homme', 'Femme']
    },
    photo: { 
        type: String, 
        required: false 
    },
    dateInscript: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: false
    },
    pieceIdentite: {
        type: String,
        required: false
    },
    permis: {
        type: String,
        required: false
    },
    statusVerfier:{
        type: Boolean,
        required: true,
        default: false
    },
    dateFinBannissement:{
        type: Date,
        required: false,
    },
    compteActif:{
        type: Boolean,
        required: true,
        default: false
    },
  

},
{ 
    timestamps: true 
}
);
const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema); 

module.exports = Utilisateur;
