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

app.get('/', (req, res) => {
  res.send('📚 Library Management API is running...');
});

app.use('/api/members', memberRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));