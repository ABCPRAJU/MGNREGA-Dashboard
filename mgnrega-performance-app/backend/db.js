// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.PG_USER || "postgres",
//   host: process.env.PG_HOST || "localhost",
//   database: process.env.PG_DATABASE || "mgnrega",
//   password: process.env.PG_PASSWORD || "enter13", // your actual pg password
//   port: process.env.PG_PORT || 5432,
// });

// pool.connect()
//   .then(() => console.log("✅ PostgreSQL Connected"))
//   .catch((err) => console.error("❌ DB Connection Error:", err));

// module.exports = pool;
const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // Required for Render or cloud DBs
        },
      }
    : {
        user: process.env.PG_USER || "postgres",
        host: process.env.PG_HOST || "localhost",
        database: process.env.PG_DATABASE || "mgnrega",
        password: process.env.PG_PASSWORD || "enter13",
        port: process.env.PG_PORT || 5432,
      }
);

pool
  .connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

module.exports = pool;
