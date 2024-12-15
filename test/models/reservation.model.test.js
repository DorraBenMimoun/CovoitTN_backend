const chai = require('chai');
const { expect } = chai;
const mongoose = require('mongoose');
const Reservation = require('../../models/reservation.model'); // Chemin relatif vers le modèle
const { MongoMemoryServer } = require('mongodb-memory-server');
const Trajet = require('../../models/trajet.model'); // Modèle Trajet pour simuler une réservation
const Utilisateur = require('../../models/utilisateur.model'); // Modèle Utilisateur pour simuler une réservation

let mongoServer;

describe('Modèle Reservation', () => {
  // Avant tous les tests, lancer une instance de MongoDB en mémoire et se connecter
  before(async () => {

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    await Utilisateur.deleteOne({ email: "john.doe@example.com" });

  });

  // Après tous les tests, déconnecter et arrêter le serveur Mongo en mémoire
  after(async () => {
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
      }

  });

  // Test : Validation des champs requis
  it('doit être invalide si des champs requis sont manquants', async () => {
    const reservation = new Reservation({
      idTrajet: null, // Trajet requis manquant
      idPassager: null, // Passager requis manquant
      dateReservation: null, // Date de réservation manquante
      nbrPlacesReservees: null, // Nombre de places réservé manquant
      etat: null, // Etat manquant
      prixTotal: null, // Prix manquant
    });

    const err = reservation.validateSync(); // Validation synchrone
    // Vérifie que les erreurs sont présentes pour chaque champ requis
    expect(err.errors.idTrajet).to.exist;
    expect(err.errors.idPassager).to.exist;
    expect(err.errors.dateReservation).to.exist;
    expect(err.errors.nbrPlacesReservees).to.exist;
    expect(err.errors.etat).to.exist;
    expect(err.errors.prixTotal).to.exist;
  });

  // Test : Validation d'une réservation valide
  it('doit être enregistrée avec succès si tous les champs requis sont fournis', async () => {
    // Créer un trajet et un utilisateur pour la réservation
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
    });
    const savedTrajet = await trajet.save();
    await Utilisateur.deleteOne({ email: "john.doe@example.com" });


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

    const reservation = new Reservation({
      idTrajet: savedTrajet._id,
      idPassager: savedUtilisateur._id,
      nbrPlacesReservees: 2,
      prixTotal: 40, // 2 places * 20 prix par place
      etat: 'En attente',
    });

    const savedReservation = await reservation.save();
    expect(savedReservation.isNew).to.be.false;
    expect(savedReservation.nbrPlacesReservees).to.equal(2);
    expect(savedReservation.prixTotal).to.equal(40);
  });

  // Test : Validation des valeurs incorrectes (état non valide)
  it('doit être invalide si l\'état n\'est pas l\'une des valeurs autorisées', async () => {
    await Utilisateur.deleteOne({ email: "john.doe@example.com" });

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
    });
    const savedTrajet = await trajet.save();

    const reservation = new Reservation({
      idTrajet: savedTrajet._id,
      idPassager: savedUtilisateur._id,
      nbrPlacesReservees: 2,
      prixTotal: 40,
      etat: 'Invalide', // Etat invalide
    });

    try {
      await reservation.validate();
    } catch (err) {
      expect(err).to.exist;
      expect(err.errors.etat).to.exist; // Vérifie que l'erreur existe pour l'état
    }
  });

  // Test : Vérification des valeurs par défaut
  it('doit définir des valeurs par défaut pour les champs non requis', async () => {
    await Utilisateur.deleteOne({ email: "john.doe@example.com" });

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
    });
    const savedTrajet = await trajet.save();

    const reservation = new Reservation({
      idTrajet: savedTrajet._id,
      idPassager: savedUtilisateur._id,
      nbrPlacesReservees: 1,
      prixTotal: 20,
    });

    expect(reservation.messagePassager).to.be.undefined; // Valeur par défaut (non défini)
    expect(reservation.etat).to.equal('En attente'); // Valeur par défaut
    expect(reservation.dateReservation).to.be.a('date'); // Date de réservation par défaut
  });
});
