import express from "express";
import {
  getExpenses,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";

const router = express.Router();

router.get("/", getExpenses); // Get all expenses
router.post("/", addExpense); // Add a new expense
router.get("/:id", getExpenseById); // Get an expense by ID
router.put("/:id", updateExpense); // Update an expense
router.delete("/:id", deleteExpense); // Delete an expense

export default router;
