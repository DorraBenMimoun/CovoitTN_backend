/*const request = require('supertest');
const app = require('../../index'); // Chemin vers votre fichier principal où l'application Express est définie
const mongoose = require('mongoose');
const Utilisateur = require('../../models/utilisateur.model'); // Chemin vers le modèle utilisateur
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');


describe('Test d\'intégration - POST /users/register', () => {
   before(async () => {
  
   });

  afterEach(async () => {
    // Nettoyer la collection utilisateur après chaque test
    await Utilisateur.deleteOne({ email: "john.doe@example.com" });
  });

  after(async () => {
    // Fermer la connexion après tous les tests
    await mongoose.connection.close();
  });

  it('devrait créer un utilisateur avec des données valides', async () => {
    const utilisateurValide = new Utilisateur({
        nom: 'John',
        prenom: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '0123456789',
        dateNaissance: '1990-01-01',
        sexe: 'Homme',
        compteActif: true,
        statusVerfier: true,
      });

    const response = await request(app)
      .post('/users/register')
      .send(utilisateurValide);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Utilisateur créé avec succès');
    expect(response.body.utilisateur).to.have.property('email', utilisateurValide.email);

    // Vérifier que l'utilisateur est dans la base de données
    const utilisateurDb = await Utilisateur.findOne({ email: utilisateurValide.email });
    //expect(utilisateurDb).not.toBeNull();
    expect(utilisateurDb.nom).to.equal(utilisateurValide.nom);
  });

  it('devrait retourner une erreur 400 pour des données manquantes', async () => {
    const utilisateurInvalide = {
      prenom: 'John', // "nom" manquant
      email: 'john.doe@example.com',
      password: 'Password123!',
    };

    const response = await request(app)
      .post('/users/register')
      .send(utilisateurInvalide);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Les données fournies sont invalides');
  });

  it('devrait retourner une erreur 400 pour un email déjà utilisé', async () => {
    const utilisateurExistant = new Utilisateur({
        nom: 'John',
        prenom: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '0123456789',
        dateNaissance: '1990-01-01',
        sexe: 'Homme',
        compteActif: true,
        statusVerfier: true,
      });

    // Créer un utilisateur existant dans la base de données
    await Utilisateur.create(utilisateurExistant);

    const response = await request(app)
      .post('/users/register')
      .send(utilisateurExistant);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Email déjà utilisé');
  });

  it('devrait retourner une erreur 400 pour un format email invalide', async () => {
    const utilisateurEmailInvalide = new Utilisateur({
        nom: 'John',
        prenom: 'Doe',
        email: 'john.doe', // Email invalide
        password: 'password123',
        phone: '0123456789',
        dateNaissance: '1990-01-01',
        sexe: 'Homme',
        compteActif: true,
        statusVerfier: true,
      });

    const response = await request(app)
      .post('/users/register')
      .send(utilisateurEmailInvalide);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Format de l\'email invalide');
  });
});
*/