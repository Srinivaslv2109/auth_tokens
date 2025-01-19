const express = require('express');
const cors = require('cors');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', publicRoutes);

module.exports = app;