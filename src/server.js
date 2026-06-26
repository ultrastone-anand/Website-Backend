const express = require('express');
const cors = require('cors');
const path = require("path");

const userRoutes = require('./routes/user.routes');
const stoneRoutes = require('./routes/stone.routes');
const reportRoutes = require('./routes/report.routes');
const lookupRoutes = require('./routes/lookup.routes');
const companyRoutes = require('./routes/company.routes');
const activityRoutes = require('./routes/activity.routes');
const dasboardRoutes = require('./routes/dashboard.routes');
const newsLetterRoutes = require('./routes/newsletter.routes');
const contactRoutes = require('./routes/contactEnquiry.routes');
const ProductRemarkRoutes =require('./routes/productRemark.routes');

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);


app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);


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
app.use('/api/company', companyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dasboardRoutes);
app.use('/api/activitie', activityRoutes);
app.use('/api/newsletter', newsLetterRoutes);
app.use('/api/products', ProductRemarkRoutes);

module.exports = app;