const express = require('express');
const app = express();
require('./config/connect');

const Utilisateur = require('./models/utilisateur.model');
const UtilisateurRouter = require('./routes/utilisateur.route');
const logger = require("morgan");
const cors = require("cors");
const http = require("http");

app.use(express.json());
app.use(logger("dev"));

//pour eviter les erreurs du front
app.use(
  cors({
    origin: ["http://localhost:3000" ],
    credentials: true,}));


app.use('/user', UtilisateurRouter);




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
  const port = normalizePort(process.env.PORT || "8000");
  app.set("port", port);

  // Gestion des erreurs
  const errorHandler = (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const address = server.address();
    const bind =
      typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges.");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use.");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  // Création du serveur HTTP
const server = http.createServer(app);
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
  
    