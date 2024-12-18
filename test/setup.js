const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur.model');
let mongoServer;
beforeAll(async () => {
  // Si une connexion existe déjà, ferme-la.
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  // Démarrer la base en mémoire et se connecter
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  // Créer un utilisateur de test et générer un token
  try {
    const utilisateur = await Utilisateur.create({
      nom: 'Test',
      prenom: 'Test',
      email: 'Test@example.com',
      password: 'Password123',
      phone: '22650656',
      dateNaissance: '1990-01-01',
      sexe: 'Femme',
    });
    // Générer un token JWT
    const token = jwt.sign({ id: utilisateur._id }, '123456789', { expiresIn: '2h'});

    // Partager l'utilisateur et le token avec les autres fichiers
    global.testUser = {id: utilisateur._id,token};
  } catch (error) {
    throw error;
  }

});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
