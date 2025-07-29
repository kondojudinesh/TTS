const { createClient } = require('@supabase/supabase-js');

// IMPORTANT: use the SERVICE ROLE key on the server
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // <-- add this env var in Render
);

// Save and return the inserted row (including filename)
const saveTranscript = async (text, filename) => {
  const { data, error } = await supabase
    .from('transcripts')
    .insert([{ text, filename }])
    .select('*')
    .single();

  if (error) throw error;
  return data; // { id, text, filename, created_at, ... }
};

const getTranscriptHistory = async () => {
  const { data, error } = await supabase
    .from('transcripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data; // array
};

module.exports = { saveTranscript, getTranscriptHistory };
