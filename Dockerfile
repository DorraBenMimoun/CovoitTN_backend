# Utilise l'image officielle de Node.js
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet dans le conteneur
COPY . .

# Exposer le port sur lequel ton app écoute
EXPOSE 8000

# Lancer le serveur avec Node.js
CMD ["node", "index.js"]

