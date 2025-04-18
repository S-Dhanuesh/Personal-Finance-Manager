import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Explicitly specify the path to .env
dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Database connected successfully!");
        connection.release();
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
})();

export default pool;















// CREATE DATABASE personal_finance_db;

// USE personal_finance_db;

// CREATE TABLE expenses (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     title VARCHAR(255) NOT NULL,
//     amount DECIMAL(10,2) NOT NULL,
//     category VARCHAR(100) NOT NULL,
//     date DATE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE budgets (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     category VARCHAR(100) UNIQUE NOT NULL,
//     `limit` DECIMAL(10,2) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
