const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`;

async function initializeDatabase() {
  try {
    await client.connect();
    await client.query(createTableQuery);
    console.log("✅ Users table ensured in the database.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  } finally {
    await client.end();
  }
}

initializeDatabase();
