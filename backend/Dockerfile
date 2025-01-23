# Utiliser une version Alpine légère de Node.js
FROM node:21.4.0-alpine

# Installer tzdata pour configurer les fuseaux horaires
RUN apk add --no-cache tzdata

# Configurer le fuseau horaire sur Europe/Paris
ENV TZ=Europe/Paris

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement les fichiers nécessaires pour les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet dans l'image Docker
COPY . .

# Vérifier que le fichier `fffService.js` est copié
RUN ls -l /usr/src/app/services

# Exposer le port utilisé par l'application
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
