dockerfile node:
# Use a Debian-based Node LTS slim image for a lightweight and secure foundation
FROM node:20-bookworm-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
# This leverages Docker's layer caching so dependencies aren't re-downloaded unless these files change
COPY package*.json ./

# Install dependencies
# Use `npm ci` for clean, reliable builds (if you have a package-lock.json)
RUN npm ci --only=production

# Copy the rest of your application's source code
COPY . .

# Switch to the default non-root user provided by the Node image for security
USER node

# Document the port the app binds to
EXPOSE 3000

# Define the command to start the application
CMD ["node", "index.js"]

Napisz prosty Dockerfile dla aplikacji Node.js, który:
- używa Node 18 jako obrazu bazowego
- kopiuje pliki package.json i package-lock.json
- instaluje zależności
- kopiuje resztę plików aplikacji
- wystawia port 3000
- uruchamia aplikację poleceniem "npm start":

# Używamy Node 18 jako obrazu bazowego
FROM node:18

# Ustawiamy katalog roboczy wewnątrz kontenera
WORKDIR /app

# Kopiujemy pliki package.json oraz package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę plików aplikacji
COPY . .

# Wystawiamy port 3000
EXPOSE 3000

# Uruchamiamy aplikację
CMD ["npm", "start"]
