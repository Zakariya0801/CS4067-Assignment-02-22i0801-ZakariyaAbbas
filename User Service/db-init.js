require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.CONNECTION_STRING;
console.log("conn = ", connectionString);

const pool = new Pool({ connectionString });

const func = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100),
                password VARCHAR(100),
                created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table created successfully");

        const result = await pool.query("SELECT * FROM users");
        console.log(result.rows);
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        pool.end();
    }
};

func();
