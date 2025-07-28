const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const saveTranscript = async (text) => {
  const { error } = await supabase.from('transcripts').insert([{ text }]);
  if (error) throw error;
};

const getTranscriptHistory = async () => {
  const { data, error } = await supabase.from('transcripts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

module.exports = { saveTranscript, getTranscriptHistory };
