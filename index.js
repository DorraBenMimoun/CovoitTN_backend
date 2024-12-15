const express = require('express');
const app = express();
require('./config/connect');
const authentification = require('./middelware/auth_middelware');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const logger = require('morgan');
const cors = require('cors');
const http = require('http');

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig'); // Importez la configuration Swagger

const UtilisateurRouter = require('./routes/utilisateur.route');
const TrajetRouter = require('./routes/trajet.route');
const ReservationRouter = require('./routes/reservation.route');
const FeedbackRouter = require('./routes/feedback.route');
const ReclamationRouter = require('./routes/reclamation.route');

const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ limit: '100mb', extended: false }));
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.json({ limit: 100 * 1024 * 1024 }));
app.use(
  bodyParser.urlencoded({
    limit: 100 * 1024 * 1024,
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use(upload.any()); // Utilisez cela pour parser les données de FormData

app.use(logger('dev'));
app.use(cookieParser());

// Définir les routes de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//pour eviter les erreurs du front
app.use(
  cors({
    origin: ['http://localhost:3000', '192.168.1.253:3000'],
    credentials: true,
  }),
);

app.use('/users', UtilisateurRouter);
app.use('/trajets', TrajetRouter);
app.use('/reservations', ReservationRouter);
app.use('/feedbacks', FeedbackRouter);
app.use('/reclamations', ReclamationRouter);

// Normaliser le port du serveur
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

// Gestion des erreurs
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Création du serveur HTTP
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
module.exports = app; // Assurez-vous d'exporter l'instance de l'application
