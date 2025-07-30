// services/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ Must use correct env var name

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Supabase URL or SERVICE_ROLE_KEY is missing.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Save transcription
const saveTranscript = async (text, filename) => {
  const { error } = await supabase.from('transcripts').insert([
    {
      filename,
      text,
    },
  ]);

  if (error) {
    throw new Error('Error saving transcript: ' + error.message);
  }
};

// Get history
const getTranscriptHistory = async () => {
  const { data, error } = await supabase
    .from('transcripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Error fetching history: ' + error.message);
  }

  return data;
};

module.exports = { saveTranscript, getTranscriptHistory };
