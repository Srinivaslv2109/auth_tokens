require('dotenv').config();
const app = require('./app');
const connectDB = require('../../main-service/src/config/database');

connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Public API service running on port ${PORT}`);
});