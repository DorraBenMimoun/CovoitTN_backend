const request = require('supertest');
const app = require('../../index'); // Remplacez par le chemin vers votre application Express
const Reservation = require('../../models/reservation.model'); // Remplacez par le chemin vers votre modèle Reservation
const Trajet = require('../../models/trajet.model');

describe('Tests d\'intégration pour le modèle Reservation', () => {
  let token;

  beforeAll(() => {
    // Récupérer le token JWT depuis la configuration globale
    token = global.testUser.token;
  });

  it('Créer une réservation avec succès', async () => {

  const trajet =new Trajet({
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
    idConducteur: global.testUser.id,
  });
  await trajet.save();

    const response = await request(app)
      .post('/reservations')
      .set('Authorization', `Bearer ${token}`) // Ajout du token JWT
      .send({
        idTrajet: trajet.id,
        idPassager: global.testUser.id,
        nbrPlacesReservees: 2,
        prixTotal: 50,
        messagePassager: 'Merci pour ce trajet!',
      }); // Utiliser la réservation de test

    expect(response.status).toBe(201);
    
  });

  it('Echouer à créer une réservation sans places', async () => {
    const trajet =new Trajet({
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
        idConducteur: global.testUser.id,
      });
      await trajet.save();
    const reservationData = {
      idTrajet: trajet.id,
      idPassager: global.testUser.id,
      nbrPlacesReservees: 0, // Réservation invalide
      dateReservation: '2024-12-20T10:00:00.000Z',
      prixTotal:10
    };

    const response = await request(app)
      .post('/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send(reservationData);

    expect(response.status).toBe(400); // Vérifie si une erreur 400 est retournée
    expect(response.body).toHaveProperty('message', 'Le nombre de places réservées doit être supérieur à 0');
  });

  it('Récupérer toutes les réservations', async () => {
    const trajet =new Trajet({
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
        idConducteur: global.testUser.id,
      });
      await trajet.save();
    // Créer deux réservations pour le test
    const reservations = [
      {
        idTrajet: trajet.id,
        idPassager: global.testUser.id,
        nbrPlacesReservees: 2,
        dateReservation: '2024-12-20T10:00:00.000Z',
        prixTotal: 50,
        
      },
      {
        idTrajet: trajet.id,
        idPassager: global.testUser.id,
        nbrPlacesReservees: 3,
        dateReservation: '2024-12-21T10:00:00.000Z',
        prixTotal: 75,
      },
    ];
    await Reservation.insertMany(reservations);

    const response = await request(app)
      .get('/reservations')
      .set('Authorization', `Bearer ${token}`);


    expect(response.status).toBe(200);
  });

  it('Ne devrait pas créer une réservation avec plus de places que disponibles', async () => {
    const trajet =new Trajet({
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
        maxPassArriere: 2,
        idConducteur: global.testUser.id,
      });
      await trajet.save();

    const reservationData = {
      idTrajet: trajet.id,
      idPassager: global.testUser.id,
      nbrPlacesReservees: 4,
      prixTotal: 100,
      messagePassager: 'Merci pour le trajet !',
    };

    const response = await request(app)
      .post('/reservations')
      .send(reservationData)
      .expect(400);

    expect(response.body.message).toBe('Nombre de places demandées supérieur aux places disponibles.');
  });
  it('devrait refuser une réservation', async () => {
    const trajet =new Trajet({
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
        idConducteur: global.testUser.id,
      });
      await trajet.save();

    const reservation = new Reservation({
      idTrajet: trajet.id,
      idPassager:  global.testUser.id,
      nbrPlacesReservees: 2,
      prixTotal: 50,
      messagePassager: 'Merci pour le trajet !',
    });
    await reservation.save();

    const response = await request(app)
      .put(`/reservations/${reservation.id}/refuser`)
      .expect(200);

    expect(response.body.etat).toBe('Refusée');
  });
});
