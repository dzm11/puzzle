const express = require('express');
const router = express.Router();

const { createClient } = require('@supabase/supabase-js');
// const dotenv = require('dotenv');
// dotenv.config(); // Wczytuje zmienne środowiskowe

// Zmienne środowiskowe
const supabaseUrl = process.env.SUPABASE_URL; // Sprawdź, czy wartość jest poprawna
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: 'Nieprawidłowy format email' });
    return;
  }
 
  try {
    const { error } = await supabase
      .from('subscribers')  // Upewnij się, że tabela istnieje
      .insert([{ email }]);

    if (error) {
      console.error('Błąd podczas zapisywania do bazy danych:', error); // Loguj błędy
      res.status(500).json({ message: 'Błąd podczas zapisywania emaila' });
      return;
    }

    res.status(200).json({ message: 'Email zapisany' });
  } catch (error) {
    console.error('Błąd:', error); // Loguj inne błędy
    res.status(500).json({ message: 'Błąd podczas zapisywania emaila' });

  }
});

module.exports = router;