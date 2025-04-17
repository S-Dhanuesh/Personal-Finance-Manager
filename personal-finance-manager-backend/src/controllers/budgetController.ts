import { Request, Response } from "express";
import { RowDataPacket, OkPacket } from "mysql2";
import db from "../config/database";
import { Budget } from "../models/budgetModel";

// Get all budgets
export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute("SELECT * FROM budgets ORDER BY category");
    const budgets = rows as Budget[];
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error });
  }
};

// Add a new budget
export const addBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, limit, month } = req.body;

    // Validate inputs
    if (
      typeof category !== 'string' ||
      typeof month !== 'string' ||
      typeof limit !== 'number'
    ) {
      res.status(400).json({
        message: "All fields are required: category (string), limit (number), month (string)."
      });
      return;
    }

    // Generate created_at timestamp
    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.execute(
      'INSERT INTO budgets (category, `limit`, `month`, `created_at`) VALUES (?, ?, ?, ?)', 
      [category, limit, month, created_at]
    );

    const insertResult = result as OkPacket;

    if (insertResult.affectedRows > 0) {
      res.status(201).json({
        message: 'Budget added successfully',
        id: insertResult.insertId,
      });
    } else {
      res.status(500).json({ message: 'Failed to add budget' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding budget', error });
  }
};

// Get a budget by ID
export const getBudgetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM budgets WHERE id = ?", [id]);
    const budgets = rows as Budget[];

    if (budgets.length === 0) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json(budgets[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budget details", error });
  }
};

// Update a budget
export const updateBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { category, limit, month } = req.body;

    if (
      typeof category !== 'string' ||
      typeof month !== 'string' ||
      typeof limit !== 'number'
    ) {
      res.status(400).json({
        message: "Fields (category: string, limit: number, month: string) are required for update."
      });
      return;
    }

    const [result] = await db.execute(
      'UPDATE budgets SET category = ?, `limit` = ?, `month` = ? WHERE id = ?',
      [category, limit, month, id]
    );

    const updateResult = result as OkPacket;

    if (updateResult.affectedRows === 0) {
      res.status(404).json({ message: 'Budget not found' });
      return;
    }

    res.json({ message: 'Budget updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating budget', error });
  }
};

// Delete a budget
export const deleteBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await db.execute("DELETE FROM budgets WHERE id = ?", [id]);

    const deleteResult = result as OkPacket;

    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ message: 'Budget not found' });
      return;
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error });
  }
};
