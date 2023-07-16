const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB);
app.listen(process.env.PORT, () => {
  console.log(`Listen on port ${process.env.PORT}`);
});
