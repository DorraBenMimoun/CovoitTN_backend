const swaggerJsDoc = require('swagger-jsdoc');

// Configuration de base pour Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Version OpenAPI
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: "Documentation de l'API pour votre projet de covoiturage",
      servers: [
        {
          url: 'http://localhost:8000',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/trajet.route.js', './routes/utilisateur.route.js','./routes/reservation.route.js','./routes/feedback.route.js','./routes/reclamation.route.js'], // Dossier où Swagger va lire les annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
