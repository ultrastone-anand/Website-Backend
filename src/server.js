const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const stoneRoutes = require('./routes/stone.routes');
const lookupRoutes = require('./routes/lookup.routes');
const reportRoutes = require('./routes/report.routes');
const activityRoutes = require('./routes/activity.routes');
const dasboardRoutes = require('./routes/dashboard.routes');

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
app.use('/api/lookups', lookupRoutes);
app.use('/api/dashboard', dasboardRoutes);
app.use('/api/activitie', activityRoutes);

module.exports = app;