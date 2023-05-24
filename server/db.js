const { Pool } = require('pg');

const pool = new Pool({
  user: 'kode',
  host: 'localhost',
  database: 'reviews',
  password: null,
  port: 5432,
});

module.exports = { pool };
