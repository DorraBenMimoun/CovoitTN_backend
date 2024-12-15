const chai = require('chai');
const { expect } = chai;
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Reclamation = require('../../models/reclamation.model'); // Chemin relatif vers le modèle
const Utilisateur = require('../../models/utilisateur.model'); // Modèle utilisateur pour référence dans les réclamations

let mongoServer;

describe('Modèle Reclamation', () => {
  before(async function () {
    this.timeout(20000); // Timeout pour éviter les erreurs de temps d'attente

    // Lancer MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });


  it('doit être invalide si des champs requis sont manquants', async () => {
    const reclamation = new Reclamation({}); // Réclamation sans champs requis

    const err = reclamation.validateSync();
    expect(err.errors.utilisateurReclamant).to.exist;
    expect(err.errors.utilisateurReclame).to.exist;
    expect(err.errors.raison).to.exist;
  });

  it('doit être valide avec des données correctes', async () => {
    const utilisateur1 = await Utilisateur.create({ nom: 'John', email: 'john.doe@example.com', compteActif: true, statusVerfier: true, password: 'password123', phone: '0123456789', dateNaissance: '1990-01-01', sexe: 'Homme',prenom:'Doe' });
    const utilisateur2 = await Utilisateur.create({ nom: 'Jane', email: 'jane.doe@example.com', compteActif: true, statusVerfier: true, password: 'password123', phone: '0123456789', dateNaissance: '1990-01-01', sexe: 'Homme',prenom:'Doe' });

    const reclamation = new Reclamation({
      utilisateurReclamant: utilisateur1._id,
      utilisateurReclame: utilisateur2._id,
      raison: 'Le comportement n’est pas acceptable.',
    });

    const savedReclamation = await reclamation.save();

    expect(savedReclamation._id).to.exist;
    expect(savedReclamation.utilisateurReclamant.toString()).to.equal(utilisateur1._id.toString());
    expect(savedReclamation.utilisateurReclame.toString()).to.equal(utilisateur2._id.toString());
    expect(savedReclamation.raison).to.equal('Le comportement n’est pas acceptable.');
    expect(savedReclamation.etat).to.equal('En cours'); // Vérifie la valeur par défaut
  });


  it('doit accepter uniquement les états valides', async () => {
    await Utilisateur.deleteOne({ email: "john.doe@example.com" });
    await Utilisateur.deleteOne({ email: "jane.doe@example.com" });
    const utilisateur1 = await Utilisateur.create({ nom: 'John', email: 'john.doe@example.com', compteActif: true, statusVerfier: true, password: 'password123', phone: '0123456789', dateNaissance: '1990-01-01', sexe: 'Homme',prenom:'Doe' });
    const utilisateur2 = await Utilisateur.create({ nom: 'Jane', email: 'jane.doe@example.com', compteActif: true, statusVerfier: true, password: 'password123', phone: '0123456789', dateNaissance: '1990-01-01', sexe: 'Homme',prenom:'Doe' });

    const reclamation = new Reclamation({
      utilisateurReclamant: utilisateur1._id,
      utilisateurReclame: utilisateur2._id,
      raison: 'Comportement inacceptable',
      etat: 'Invalide', // État non défini dans l'enum
    });

    const err = reclamation.validateSync();
    expect(err.errors.etat).to.exist;
  });

  it('doit définir la dateTraitement et la réponse si l’état est modifié', async () => {
    await Utilisateur.deleteOne({ email: "john.doe@example.com" });
    await Utilisateur.deleteOne({ email: "jane.doe@example.com" });

    const utilisateur1 = await Utilisateur.create({ nom: 'John', email: 'john.doe@example.com', compteActif: true, statusVerfier: true, password: 'password123', phone: '0123456789', dateNaissance: '1990-01-01', sexe: 'Homme',prenom:'Doe' });
    const utilisateur2 = await Utilisateur.create({ nom: 'Jane', email: 'jane.doe@example.com', compteActif: true, statusVerfier: true, password: 'password123', phone: '0123456789', dateNaissance: '1990-01-01', sexe: 'Homme',prenom:'Doe' });

    const reclamation = await Reclamation.create({
      utilisateurReclamant: utilisateur1._id,
      utilisateurReclame: utilisateur2._id,
      raison: 'Comportement inacceptable',
    });

    reclamation.etat = 'Traitée';
    reclamation.dateTraitement = new Date();
    reclamation.reponse = 'Nous avons traité votre réclamation.';

    const updatedReclamation = await reclamation.save();

    expect(updatedReclamation.etat).to.equal('Traitée');
    expect(updatedReclamation.dateTraitement).to.exist;
    expect(updatedReclamation.reponse).to.equal('Nous avons traité votre réclamation.');
  });
});
