const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const stoneRoutes = require('./routes/stone.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ultrastone API Running'
  });
});

app.use('/api/users', userRoutes);
app.use('/api/stones', stoneRoutes);
app.use('/api/reports', reportRoutes);

module.exports = app;