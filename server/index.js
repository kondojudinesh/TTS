const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/audio', require('./routes/audioRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.get('/', (req, res) => {
  res.send('✅ Speech-to-Text Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
