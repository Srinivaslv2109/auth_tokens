require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Main service running on port ${PORT}`);
});