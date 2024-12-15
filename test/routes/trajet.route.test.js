/*const request = require('supertest');
const app = require('../../index');  // Importer l'application Express depuis index.js
const { expect } = require('chai');
const Trajet = require('../../models/trajet.model'); // Votre modèle Trajet
const jwt = require('jsonwebtoken');
const Utilisateur = require('../../models/utilisateur.model.js'); // Si vous avez un modèle User pour gérer les utilisateurs

const mongoose = require('mongoose');



describe('POST /trajets', () => {
  let token=null;
  let userId;
  const generateToken = () => {
    return jwt.sign({ _id: userId }, '123456789', { expiresIn: '2h' });
  };
  beforeEach(async () => {
    await Utilisateur.deleteOne({ email: 'john.doe@example.com' });
    await Trajet.deleteOne({ idConducteur: userId });

    // Créer un utilisateur pour tester l'authentification
    const utilisateur = new Utilisateur({
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'password123', // Assurez-vous que ce mot de passe est sécurisé dans un vrai projet
      phone: '0123456789',
      dateNaissance: '1990-01-01',
      sexe: 'Homme',
      compteActif: true,
      statusVerfier: true
    });

    await utilisateur.save();
    userId = utilisateur._id;
    

    // Générer un token JWT
    token = generateToken();
    console.log('token',token);
  });


  it('devrait créer un nouveau trajet si le token est valide', async () => {
    const trajetData = {
      idConducteur: userId,
      pointDepart: {
        description: "Paris",
        place_id: "ChIJ7cmZ1p4MZ0gR2qA-hr2ZAZ8",
        reference: "ChIJ7cmZ1p4MZ0gR2qA-hr2ZAZ8",
        terms: ["Paris", "France"]
      },
      pointArrivee: {
        description: "Lyon",
        place_id: "ChIJa2n9O4hXqEcRdeOpqT4gR1w",
        reference: "ChIJa2n9O4hXqEcRdeOpqT4gR1w",
        terms: ["Lyon", "France"]
      },
      dateDepart: '2024-12-15',
      heureDepart: '10:00',
      placesDispo: 3,
      prixTrajet: 25,
      distance: 10,
      duree: 15,
      fumeur: false,
      animaux: false,
      filleUniquement: false,
      maxPassArriere: 2,
    };

    const res = await request(app)
      .post('/trajets')
      .set('Authorization', `Bearer ${token}`)  // envoi du token dans l'en-tête
      .send(trajetData);
      console.log('req.status',res.status,res.error);

    // Vérifier que la réponse est correcte
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    expect(res.body.idConducteur.toString()).to.equal(userId.toString()); // Vérifier que l'id du conducteur correspond
    expect(res.body.pointDepart.description).to.equal(trajetData.pointDepart.description);
    expect(res.body.pointArrivee.description).to.equal(trajetData.pointArrivee.description);
  });

  it('devrait retourner une erreur si les coordonnées de départ sont manquantes', async () => {
    const trajetData = {
      pointArrivee: {
        description: "Lyon",
        place_id: "ChIJa2n9O4hXqEcRdeOpqT4gR1w",
        reference: "ChIJa2n9O4hXqEcRdeOpqT4gR1w",
        terms: ["Lyon", "France"]
      },
      dateDepart: '2024-12-15',
      heureDepart: '10:00',
      placesDispo: 3,
      prixTrajet: 25,
      distance: 10,
      duree: 15,
      fumeur: false,
      animaux: false,
      filleUniquement: false,
      maxPassArriere: 2,
    };

    const res = await request(app)
      .post('/trajets')
      .set('Authorization', `Bearer ${token}`)  // envoi du token dans l'en-tête
      .send(trajetData);

    // Vérifier que la réponse est une erreur 400
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Les coordonnées du point de départ sont requises.');
  });

  it('devrait retourner une erreur 401 si le token est manquant', async () => {
    const trajetData = {
      pointDepart: {
        description: "Paris",
        place_id: "ChIJ7cmZ1p4MZ0gR2qA-hr2ZAZ8",
        reference: "ChIJ7cmZ1p4MZ0gR2qA-hr2ZAZ8",
        terms: ["Paris", "France"]
      },
      pointArrivee: {
        description: "Lyon",
        place_id: "ChIJa2n9O4hXqEcRdeOpqT4gR1w",
        reference: "ChIJa2n9O4hXqEcRdeOpqT4gR1w",
        terms: ["Lyon", "France"]
      },
      dateDepart: '2024-12-15',
      heureDepart: '10:00',
      placesDispo: 3,
      prixTrajet: 25,
      distance: 10,
      duree: 15,
      fumeur: false,
      animaux: false,
      filleUniquement: false,
      maxPassArriere: 2,
    };

    const res = await request(app)
      .post('/trajets')
      .send(trajetData); // Ne pas envoyer de token

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Authentication token missing');
  });
});


describe('PUT /trajets/:id', () => {
  let token;
  let userId;
  let trajetId;

  beforeEach(async () => {
    // Nettoyer les collections de tests
    await Utilisateur.deleteOne({ email: 'john.doe@example.com' });


    // Créer un utilisateur pour générer un token
    const utilisateur = new Utilisateur({
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '0123456789',
      dateNaissance: '1990-01-01',
      sexe: 'Homme',
      compteActif: true,
      statusVerfier: true
    });

    await utilisateur.save();
    userId = utilisateur._id;

    // Générer un token JWT
    token = jwt.sign({ _id: userId }, '123456789', { expiresIn: '2h' });

    // Créer un trajet pour le test
    const trajet = new Trajet({
      idConducteur: userId,
      pointDepart: { description: "Paris", place_id: "place1" , reference: "ref1", terms: ["Paris"] },
      pointArrivee: { description: "Lyon", place_id: "place2", reference: "ref2", terms: ["Lyon"] },
      dateDepart: '2024-12-15',
      heureDepart: '10:00',
      placesDispo: 3,
      prixTrajet: 25,
      distance: 10,
      duree: 15,
      fumeur: false,
      animaux: false,
      filleUniquement: false,
      maxPassArriere: 2,
    });

    await trajet.save();
    trajetId = trajet._id;
  });

  it('devrait mettre à jour un trajet si le token est valide', async () => {
    const updatedData = {
      pointDepart: { description: "Marseille", place_id: "place3", reference: "ref3", terms: ["Marseille"] },
      pointArrivee: { description: "Nice", place_id: "place4" , reference: "ref4", terms: ["Nice"] },
      prixTrajet: 30,
    };

    const res = await request(app)
      .put(`/trajets/${trajetId}`)
      .set('Authorization', `Bearer ${token}`) // Envoi du token dans l'en-tête
      .send(updatedData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id');
    expect(res.body.pointDepart.description).to.equal(updatedData.pointDepart.description);
    expect(res.body.pointArrivee.description).to.equal(updatedData.pointArrivee.description);
    expect(res.body.prixTrajet).to.equal(updatedData.prixTrajet);
  });

  it('devrait retourner une erreur 401 si le token est manquant', async () => {
    const updatedData = {
      pointDepart: { description: "Marseille", place_id: "place3", reference: "ref3", terms: ["Marseille"] },
      pointArrivee: { description: "Nice", place_id: "place4", reference: "ref4", terms: ["Nice"] },
      prixTrajet: 30,
    };

    const res = await request(app)
      .put(`/trajets/${trajetId}`)
      .send(updatedData); // Pas de token envoyé

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Authentication token missing');
  });

  it('devrait retourner une erreur 400 si les données sont invalides', async () => {
    const invalidData = {
      pointDepart: {}, // Point de départ vide
      prixTrajet: -10, // Prix invalide
    };

    const res = await request(app)
      .put(`/trajets/${trajetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    expect(res.status).to.equal(400);
  });

  it('devrait retourner une erreur 404 si le trajet n’existe pas', async () => {
    const fakeTrajetId =new mongoose.Types.ObjectId(); // ID valide mais inexistant
    const updatedData = {
      pointDepart: { description: "Paris", place_id: "place1" , reference: "ref1", terms: ["Paris"] },
      pointArrivee: { description: "Lyon", place_id: "place2", reference: "ref2", terms: ["Lyon"] },
      dateDepart: '2024-12-15',
      heureDepart: '10:00',
      placesDispo: 3,
      prixTrajet: 25,
      distance: 10,
      duree: 15,
      fumeur: false,
      animaux: false,
      filleUniquement: false,
      maxPassArriere: 2,
    };
  

    const res = await request(app)
      .put(`/trajets/${fakeTrajetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Trajet non trouvé.');
  });
});

*/