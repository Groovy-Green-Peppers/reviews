require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const router = require('./routes/reviewsRoutes');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/reviews', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server available at ${PORT}`);
});
