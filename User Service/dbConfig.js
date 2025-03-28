require('dotenv').config();

const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === "production";
const ENVS = process.env;

// const connectionString =  `postgresql://${ENVS.DB_USER}:${ENVS.DB_PASSWORD}@${ENVS.DB_HOST}:${ENVS.DB_PORT}/${ENVS.DB_DATABASE}`;
const connectionString = process.env.CONNECTION_STRING;
console.log("conn = ",connectionString);

const pool = new Pool({ connectionString });

module.exports = { pool };