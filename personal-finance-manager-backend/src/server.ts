import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/database"; // Import database connection
import expenseRoutes from "./routes/expenseRoutes"; // Import Expense Routes
import budgetRoutes from "./routes/budgetRoutes"; // Import Budget Routes


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api/expenses", expenseRoutes); // ✅ Expenses
app.use("/api/budgets", budgetRoutes); // ✅ Budgets


// Test route
app.get("/", (req, res) => {
    res.send("🚀 Personal Finance Manager Server is running successfully!");
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.json({ message: "✅ Database connected successfully!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Database connection failed", details: error });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Personal Finance Manager Server running on http://localhost:${PORT}`);
});






// npx ts-node src/server.ts