const chai = require('chai');
const { expect } = chai;
const mongoose = require('mongoose');
const Utilisateur = require('../../models/utilisateur.model'); // Chemin relatif vers le modèle
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('Modèle Utilisateur', () => {
  // Avant tous les tests, lancer une instance de MongoDB en mémoire et se connecter
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Après tous les tests, déconnecter et arrêter le serveur Mongo en mémoire
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Test : Validation des champs requis
  it('doit être invalide si des champs requis sont manquants', async () => {
    const utilisateur = new Utilisateur({
      nom: null, // Champ requis manquant
      prenom: null, // Champ requis manquant
      email: null, // Champ requis manquant
      password: null, // Champ requis manquant
      phone: null, // Champ requis manquant
      dateNaissance: null, // Champ requis manquant
      sexe: null, // Champ requis manquant
      compteActif: null, // Champ requis manquant
      statusVerfier: null, // Champ requis manquant
    });

    const err = utilisateur.validateSync(); // Validation synchrone

    // Vérifie que les erreurs sont présentes pour chaque champ requis
    expect(err.errors.nom).to.exist;
    expect(err.errors.prenom).to.exist;
    expect(err.errors.email).to.exist;
    expect(err.errors.password).to.exist;
    expect(err.errors.phone).to.exist;
    expect(err.errors.dateNaissance).to.exist;
    expect(err.errors.sexe).to.exist;
    expect(err.errors.compteActif).to.exist;
    expect(err.errors.statusVerfier).to.exist;
  });

  // Test : Validation de l'email
  it("doit être invalide si l'email n'est pas valide", async () => {
    const utilisateur = new Utilisateur({
      nom: 'John',
      prenom: 'Doe',
      email: 'invalid-email', // Email invalide
      password: 'password123',
      phone: '0123456789',
      dateNaissance: '1990-01-01',
      sexe: 'Homme',
      compteActif: true,
      statusVerfier: true,
    });

    try {
      await utilisateur.validate();
    } catch (err) {
      expect(err).to.exist;
      expect(err.errors.email).to.exist; // Vérifie que l'erreur existe pour l'email
    }
  });

  // Test : Validation d'un utilisateur valide
  it("doit sauvegarder l'utilisateur si tous les champs requis sont fournis", async () => {
    const utilisateur = new Utilisateur({
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

    const savedUtilisateur = await utilisateur.save();
    expect(savedUtilisateur.isNew).to.be.false;
  });

  // Test : Validation des valeurs incorrectes
  it('doit être invalide si le numéro de téléphone est manquant', async () => {
    const utilisateur = new Utilisateur({
      nom: 'John',
      prenom: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: null, // Numéro de téléphone manquant
      dateNaissance: '1990-01-01',
      sexe: 'Homme',
      compteActif: true,
      statusVerfier: true,
    });

    try {
      await utilisateur.validate();
    } catch (err) {
      expect(err).to.exist;
      expect(err.errors.phone).to.exist; // Vérifie que l'erreur existe pour le numéro de téléphone
    }
  });

  // Test : Validation des valeurs par défaut
  it("doit définir des valeurs par défaut pour les champs non requis", async () => {
    const utilisateur = new Utilisateur({
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

    expect(utilisateur.photo).to.be.undefined;
    expect(utilisateur.description).to.be.undefined;
    expect(utilisateur.pieceIdentite).to.be.undefined;
    expect(utilisateur.permis).to.be.undefined;
    expect(utilisateur.dateFinBannissement).to.be.undefined;
    expect(utilisateur.createdAt).to.be.a('date'); // Doit être une date
  });
});
