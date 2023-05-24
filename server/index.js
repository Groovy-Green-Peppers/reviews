require('dotenv').config();
// const path = require('path');
const db = require('./db');

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

// These two middlewares work hand-in-hand with one another
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.static(path.join(__dirname, '../client/dist')));

const PORT = process.env.PORT || 3000; // <-- 8080 is also common
app.listen(PORT, () => {
  console.log(`Server available at http://localhost:${PORT}`);
});
