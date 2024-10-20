const swaggerJsDoc = require('swagger-jsdoc');

// Configuration de base pour Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0", // Version OpenAPI
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Documentation de l'API pour votre projet de covoiturage",
            servers: [
                {
                    url: "http://localhost:8000",
                }
            ]
        }
    },
    apis: ["./routes/trajet.route.js"] // Dossier où Swagger va lire les annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
