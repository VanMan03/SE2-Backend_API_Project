const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const memberRoutes = require('./routes/memberRoutes');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');

dotenv.config();
connectDB();
const app = express();
app.use(bodyParser.json());

app.use('/api', memberRoutes);
app.use('/api', bookRoutes);
app.use('/api', loanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));