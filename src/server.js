const express = require('express');
const cors = require('cors');

const stoneRoutes = require('./routes/stone.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ultrastone API Running'
  });
});

app.use('/api/stones', stoneRoutes);

module.exports = app;