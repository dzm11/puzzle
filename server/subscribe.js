// const express = require('express');
// const router = express.Router();

// const { createClient } = require('@supabase/supabase-js');
// // const dotenv = require('dotenv');
// // dotenv.config(); // Wczytuje zmienne środowiskowe

// // Zmienne środowiskowe
// const supabaseUrl = process.env.SUPABASE_URL; // Sprawdź, czy wartość jest poprawna
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// router.post('/', async (req, res) => {
//   const { email } = req.body;

//   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     res.status(400).json({ message: 'Nieprawidłowy format email' });
//     return;
//   }
 
//   try {
//     const { error } = await supabase
//       .from('subscribers')  // Upewnij się, że tabela istnieje
//       .insert([{ email }]);

//     if (error) {
//       console.error('Błąd podczas zapisywania do bazy danych:', error); // Loguj błędy
//       res.status(500).json({ message: 'Błąd podczas zapisywania emaila' });
//       return;
//     }

//     res.status(200).json({ message: 'Email zapisany' });
//   } catch (error) {
//     console.error('Błąd:', error); // Loguj inne błędy
//     res.status(500).json({ message: 'Błąd podczas zapisywania emaila' });

//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config(); // Wczytaj zmienne środowiskowe

const supabaseUrl = process.env.SUPABASE_URL; // Sprawdź, czy wartość jest poprawna
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.post('/', async (req, res) => {
  const { email } = req.body;

  // Sprawdź, czy email ma poprawny format
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: 'Nieprawidłowy format email' });
    return;
  }

  try {
    // Sprawdź, czy adres e-mail już istnieje
    const { data, error: selectError } = await supabase
      .from('subscribers')  // Tabela, gdzie przechowujesz email
      .select('*')  // Wybierz wszystkie kolumny
      .eq('email', email)  // Sprawdź, czy e-mail już istnieje
      .single();  // Oczekuj jednego wiersza lub błędu

    if (selectError && selectError.code !== 'PGRST116') {
      // Jeśli wystąpił inny błąd niż nieznalezienie, zwróć go
      console.error('Błąd podczas sprawdzania istniejących emaili:', selectError);
      res.status(500).json({ message: 'Błąd podczas sprawdzania emaili' });
      return;
    }

    if (data) {
      // Jeśli e-mail już istnieje, zwróć odpowiedź 409 (Conflict)
      res.status(409).json({ message: 'Adres e-mail już istnieje w bazie danych' });
      return;
    }

    // Jeśli e-mail nie istnieje, dodaj go do bazy danych
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (insertError) {
      // Jeśli błąd podczas dodawania, zwróć błąd 500
      console.error('Błąd podczas zapisywania do bazy danych:', insertError);
      res.status(500).json({ message: 'Błąd podczas zapisywania emaila' });
      return;
    }

    // Jeśli wszystko poszło dobrze, zwróć odpowiedź 200 (OK)
    res.status(200).json({ message: 'Email zapisany' });
  } catch (error) {
    // Obsługa innych wyjątków
    console.error('Błąd:', error);
    res.status(500).json({ message: 'Błąd podczas zapisywania emaila' });
  }
});

module.exports = router;
