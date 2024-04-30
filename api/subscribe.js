import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) throw error;

      res.status(200).json({ message: 'Email zapisany' });
    } catch (error) {
      res.status(500).json({ message: 'Błąd podczas zapisywania emaila' });
    }
  } else {
    res.status(405).json({ message: 'Metoda nie dozwolona' });
  }
};
