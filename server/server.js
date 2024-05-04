const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const subscribe = require('./subscribe'); // Import do endpointu


const app = express();
app.use(bodyParser.json());

// Serwowanie plików statycznych
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint do zapisywania emaili
app.use('/api/subscribe', subscribe); // Obsługuje ścieżkę /api/subscribe

// Serwowanie strony głównej
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html')); // Ścieżka do strony głównej
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
