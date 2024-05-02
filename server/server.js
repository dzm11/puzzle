// Wczytanie zmiennych środowiskowych z pliku .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const subscribe = require('./subscribe'); // Endpoint do zapisywania emaili


const app = express();

// Parsowanie danych JSON
app.use(bodyParser.json());

// Serwowanie plików statycznych z folderu public
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint do zapisywania emaili
app.use('/api/subscribe', subscribe);

// Ustawienie strony głównej
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html')); // Serwuje index.html jako stronę główną
});

// Uruchomienie serwera na porcie 3000

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});