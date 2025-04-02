const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// සරල API endpoint උදාහරණයක්
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

// තවත් endpoints එකතු කරන්න
app.post('/api/submit', (req, res) => {
  console.log(req.body);
  res.json({ success: true, data: req.body });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});