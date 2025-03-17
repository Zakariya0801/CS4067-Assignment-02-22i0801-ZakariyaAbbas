require('dotenv').config();

const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === "production";
const ENVS = process.env;

// const connectionString =  `postgresql://${ENVS.DB_USER}:${ENVS.DB_PASSWORD}@${ENVS.DB_HOST}:${ENVS.DB_PORT}/${ENVS.DB_DATABASE}`;
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
console.log("conn = ", isProduction ? process.env.DATABASE_URL : connectionString);

const pool = new Pool({ connectionString });

module.exports = { pool };