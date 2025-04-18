import express from "express";
import {
  getBudgets,
  addBudget,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController";

const router = express.Router();

router.get("/", getBudgets); // Get all budgets
router.post("/", addBudget); // Add a new budget
router.get("/:id", getBudgetById); // Get a budget by ID
router.put("/:id", updateBudget); // Update a budget
router.delete("/:id", deleteBudget); // Delete a budget

export default router;
