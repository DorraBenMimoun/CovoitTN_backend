const chai = require('chai');
const { expect } = chai;
const mongoose = require('mongoose');
const Trajet = require('../../models/trajet.model'); // Chemin relatif vers le modèle
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('Modèle Trajet', () => {
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
    const trajet = new Trajet({
      idConducteur: null, // ou ne pas inclure ce champ
      dateDepart: null,
      heureDepart: null,
      duree: null,
      distance: null,
      placesDispo: null,
      prixTrajet: null,
      pointDepart: { description: null }, // Point départ laissé vide
      pointArrivee: { description: null } // Point arrivée laissé vide
    });

    const err = trajet.validateSync(); // Validation synchrone

    // Vérifie que les erreurs sont présentes pour chaque champ requis
    expect(err.errors.idConducteur).to.exist;
    expect(err.errors.dateDepart).to.exist;
    expect(err.errors.heureDepart).to.exist;
    expect(err.errors.duree).to.exist;
    expect(err.errors.distance).to.exist;
    expect(err.errors.placesDispo).to.exist;
    expect(err.errors.prixTrajet).to.exist;
    expect(err.errors['pointDepart.description']).to.exist;
    expect(err.errors['pointArrivee.description']).to.exist;
  });

  // Test : Validation d'un trajet valide
  it('doit être enregistré avec succès si tous les champs requis sont fournis', async () => {
    const trajet = new Trajet({
      idConducteur: new mongoose.Types.ObjectId(),
      dateDepart: new Date(),
      heureDepart: '12:30',
      duree: 120, // 2 heures
      distance: 150, // 150 km
      placesDispo: 4,
      prixTrajet: 25.0,
      pointDepart: {
        description: 'Place de Barcelone, Tunis',
        place_id: '123abc',
        reference: 'xyz456',
        terms: ['Place', 'Barcelone'],
      },
      pointArrivee: {
        description: 'Avenue Habib Bourguiba, Sousse',
        place_id: '456def',
        reference: 'abc789',
        terms: ['Avenue', 'Habib', 'Bourguiba'],
      },
    });

    const savedTrajet = await trajet.save();
    expect(savedTrajet.isNew).to.be.false;
  });

  // Test : Validation des valeurs incorrectes
  it('doit être invalide si le nombre de places disponibles est négatif', async () => {
    const trajet = new Trajet({
      idConducteur: new mongoose.Types.ObjectId(),
      dateDepart: new Date(),
      heureDepart: '10:00',
      duree: 90,
      distance: 80,
      placesDispo: -1, // Valeur invalide
      prixTrajet: 15.0,
      pointDepart: {
        description: 'Place de Barcelone, Tunis',
        place_id: '123abc',
        reference: 'xyz456',
        terms: ['Place', 'Barcelone'],
      },
      pointArrivee: {
        description: 'Avenue Habib Bourguiba, Sousse',
        place_id: '456def',
        reference: 'abc789',
        terms: ['Avenue', 'Habib', 'Bourguiba'],
      },
    });

    try {
      await trajet.validate();
    } catch (err) {
      expect(err).to.exist;
      expect(err.errors.placesDispo).to.exist; // Vérifie que l'erreur existe
    }
  });

  // Test : Validation des valeurs par défaut
  it('doit définir des valeurs par défaut pour les champs non requis', async () => {
    const trajet = new Trajet({
      idConducteur: new mongoose.Types.ObjectId(),
      dateDepart: new Date(),
      heureDepart: '14:00',
      duree: 180,
      distance: 200,
      placesDispo: 3,
      prixTrajet: 30.0,
      pointDepart: {
        description: 'Cité El Khadra, Tunis',
        place_id: 'abc123',
        reference: 'ref456',
        terms: ['Cité', 'El', 'Khadra'],
      },
      pointArrivee: {
        description: 'Ariana, Tunisie',
        place_id: 'def456',
        reference: 'ref789',
        terms: ['Ariana', 'Tunisie'],
      },
    });

    expect(trajet.animaux).to.be.undefined;
    expect(trajet.fumeur).to.be.undefined;
    expect(trajet.filleUniquement).to.be.undefined;
    expect(trajet.archieved).to.be.false; // Valeur par défaut
    expect(trajet.createdAt).to.be.a('date'); // Doit être une date
  });
});
