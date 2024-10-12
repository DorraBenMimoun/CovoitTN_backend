const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur.model');
const UtilisateurRouter = require('./routes/utilisateur.route');
app.use(express.json());


app.use('/utilisateurs', UtilisateurRouter);
mongoose.connect("mongodb+srv://covoittn:covoittn@covoittn.697vd.mongodb.net/?retryWrites=true&w=majority&appName=CovoitTN").then(() => {   
    console.log("Connected to database!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    }).catch(() => {
    console.log("Connection failed!");
    });