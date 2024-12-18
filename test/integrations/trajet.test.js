const request = require('supertest');
const app = require('../../index');

describe('Gérer trajets', () => {
  let trajetId;
  it('devrait créer un trajet valide', async () => {
    const response = await request(app)
      .post('/trajets')
      .set('Authorization', `Bearer ${global.testUser.token}`) // Inclure le token automatiquement
      .send({
        pointDepart: {
          description: 'Paris',
          place_id: 'ChIJ7cmZ1p4MZ0gR2qA-hr2ZAZ8',
          reference: 'ChIJ7cmZ1p4MZ0gR2qA-hr2ZAZ8',
          terms: ['Paris', 'France'],
        },
        pointArrivee: {
          description: 'Lyon',
          place_id: 'ChIJa2n9O4hXqEcRdeOpqT4gR1w',
          reference: 'ChIJa2n9O4hXqEcRdeOpqT4gR1w',
          terms: ['Lyon', 'France'],
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
      });

    expect(response.status).toBe(200);
    expect(response._body).toHaveProperty('heureDepart', '10:00');

    trajetId = response._body._id;
  });

  it('devrait retourner une erreur si les champs sont invalides', async () => {
    const response = await request(app)
      .post('/trajets')
      .set('Authorization', `Bearer ${global.testUser.token}`)
      .send({
        pointArrivee: {
          description: 'Lyon',
          place_id: 'ChIJa2n9O4hXqEcRdeOpqT4gR1w',
          reference: 'ChIJa2n9O4hXqEcRdeOpqT4gR1w',
          terms: ['Lyon', 'France'],
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
      });

    expect(response.status).toBe(400);
    expect(response._body.message).toBe(
      'Les coordonnées du point de départ sont requises.',
    );
  });

  it('devrait retourner une liste de trajets', async () => {
    const response = await request(app).get('/trajets');

    expect(response.status).toBe(200);
    expect(response._body).toBeInstanceOf(Array);
  });

  it('devrait modifier un trajet existant', async () => {
    expect(trajetId).toBeDefined();

    const response = await request(app)
      .put(`/trajets/${trajetId}`)
      .set('Authorization', `Bearer ${global.testUser.token}`)
      .send({
        prixTrajet: 30,
      });

    expect(response.status).toBe(200);
    expect(response._body).toHaveProperty('prixTrajet', 30);
  });

  it('devrait supprimer un trajet existant', async () => {
    expect(trajetId).toBeDefined();

    const response = await request(app)
      .delete(`/trajets/${trajetId}`)
      .set('Authorization', `Bearer ${global.testUser.token}`);

    expect(response.status).toBe(200);
  });
});
