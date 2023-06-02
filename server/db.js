const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'ec2-3-133-122-58.us-east-2.compute.amazonaws.com',
  database: 'reviews',
  password: 'anything',
  port: 6432,
  max: 200,
  allowExitOnIdle: true,
});

module.exports = { pool };
