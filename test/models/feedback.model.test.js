const chai = require('chai');
const { expect } = chai;
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Feedback = require('../../models/feedback.model'); // Modèle Feedback
const Trajet = require('../../models/trajet.model'); // Modèle Trajet pour simulation
const Utilisateur = require('../../models/utilisateur.model'); // Modèle Utilisateur pour simulation

let mongoServer;

describe('Modèle Feedback', () => {
  before(async () => {
    // Démarrer MongoDB en mémoire
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Créer des données fictives pour Trajet et Utilisateur
    const trajet = new Trajet({
        idConducteur: new mongoose.Types.ObjectId(),
        dateDepart: new Date(),
        heureDepart: '10:00',
        duree: 120,
        distance: 150,
        placesDispo: 4,
        prixTrajet: 20,
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
      });    const utilisateur = await Utilisateur.create({ nom: 'John', email: 'john.doe@example.com', compteActif: true, statusVerfier: true, password: 'password123', phone: '0123456789', dateNaissance: '1990-01-01', sexe: 'Homme',prenom:'Doe' });
    await trajet.save();
    await utilisateur.save();

    this.trajetId = trajet._id;
    this.utilisateurId = utilisateur._id;
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('doit être invalide si des champs requis sont manquants', async () => {
    const feedback = new Feedback({
      idTrajet: null, // Champ requis manquant
      idPassager: null, // Champ requis manquant
      note: null, // Champ requis manquant
    });

    const err = feedback.validateSync();
    expect(err.errors.idTrajet).to.exist;
    expect(err.errors.idPassager).to.exist;
    expect(err.errors.note).to.exist;
  });

  it('doit accepter une création valide', async () => {
    const feedback = new Feedback({
      idTrajet: this.trajetId,
      idPassager: this.utilisateurId,
      note: 4,
      description: 'Service excellent.',
    });

    const savedFeedback = await feedback.save();
    expect(savedFeedback._id).to.exist;
    expect(savedFeedback.note).to.equal(4);
    expect(savedFeedback.description).to.equal('Service excellent.');
  });

  it('doit rejeter une note en dehors de la plage [1, 5]', async () => {
    const feedback = new Feedback({
      idTrajet: this.trajetId,
      idPassager: this.utilisateurId,
      note: 6, // Note invalide
    });

    const err = feedback.validateSync();
    expect(err.errors.note).to.exist;
    expect(err.errors.note.message).to.equal('Path `note` (6) is more than maximum allowed value (5).');
  });

  it('doit permettre des descriptions optionnelles', async () => {
    const feedback = new Feedback({
      idTrajet: this.trajetId,
      idPassager: this.utilisateurId,
      note: 3,
    });

    const savedFeedback = await feedback.save();
    expect(savedFeedback.description).to.be.undefined;
  });

  it('doit supprimer les espaces inutiles dans la description', async () => {
    const feedback = new Feedback({
      idTrajet: this.trajetId,
      idPassager: this.utilisateurId,
      note: 5,
      description: '   Excellent service!   ',
    });

    const savedFeedback = await feedback.save();
    expect(savedFeedback.description).to.equal('Excellent service!');
  });
});
