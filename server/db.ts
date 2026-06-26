import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ Database Error:", err));

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Database Time:", res.rows[0]);
  }
});
