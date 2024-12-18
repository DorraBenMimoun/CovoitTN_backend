const request = require('supertest');
const app = require('../../index');
const Utilisateur = require('../../models/utilisateur.model');

afterEach(async () => {
  // Supprimer tous les utilisateurs après chaque test SAUF l'utilisateur de test
  await Utilisateur.deleteMany({ email: { $ne: 'Test@example.com' } });
});

describe('Register an user', () => {
  it('devrait enregistrer un utilisateur valide', async () => {
    const response = await request(app).post('/users/register').send({
      nom: 'John',
      prenom: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      phone: '22650656',
      dateNaissance: '1990-01-01',
      sexe: 'Femme',
    });
    expect(response.status).toBe(200);
    expect(response._body).toHaveProperty('token');
    expect(response._body.user).toHaveProperty('email', 'john.doe@example.com');
  });

  it("devrait retourner une erreur si l'email est invalide", async () => {
    const response = await request(app).post('/users/register').send({
      nom: 'John',
      prenom: 'Doe',
      email: 'john.doe@example',
      password: 'Password123',
      phone: '22650656',
      dateNaissance: '1990-01-01',
      sexe: 'Femme',
    });
    expect(response.status).toBe(400);
    expect(response._body.message).toBe('email invalide');
  });

  it("devrait empêcher l'inscription avec un email déjà utilisé", async () => {
    const utilisateur = new Utilisateur({
      nom: 'John',
      prenom: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      phone: '22650656',
      dateNaissance: '1990-01-01',
      sexe: 'Femme',
    });
    await utilisateur.save();

    const response = await request(app).post('/users/register').send({
      nom: 'John',
      prenom: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      phone: '22650656',
      dateNaissance: '1990-01-01',
      sexe: 'Femme',
    });
    expect(response.status).toBe(400);
    expect(response._body.message).toBe('essayer un autre email ');
  });
});

describe('Login an user', () => {
  it('devrait connecter un utilisateur valide', async () => {
    // Register a user
    const registerResponse = await request(app).post('/users/register').send({
      nom: 'John',
      prenom: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      phone: '22650656',
      dateNaissance: '1990-01-01',
      sexe: 'Femme',
    });

    expect(registerResponse.status).toBe(200);

    const response = await request(app).post('/users/login').send({
      email: 'john.doe@example.com',
      password: 'Password123',
    });
    expect(response.status).toBe(200);
    expect(response._body).toHaveProperty('token');
  });

  it('devrait retourner une erreur si le mot de passe est incorrect', async () => {
    // Register a user
    const registerResponse = await request(app).post('/users/register').send({
      nom: 'John',
      prenom: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      phone: '22650656',
      dateNaissance: '1990-01-01',
      sexe: 'Femme',
    });

    expect(registerResponse.status).toBe(200);

    const response = await request(app).post('/users/login').send({
      email: 'john.doe@example.com',
      password: 'PasswordIncorrect',
    });
    expect(response.status).toBe(400);
    expect(response._body.message).toBe('email or password incorrect');
  });
});
