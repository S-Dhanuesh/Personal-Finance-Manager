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
    const { category, limit } = req.body;

    const [result] = await db.execute(
      "INSERT INTO budgets (category, `limit`) VALUES (?, ?)", // ✅ escaped `limit`
      [category, limit]
    );

    const insertResult = result as OkPacket;

    if (insertResult.affectedRows > 0) {
      res.status(201).json({
        message: "Budget added successfully",
        id: insertResult.insertId,
      });
    } else {
      res.status(500).json({ message: "Failed to add budget" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding budget", error });
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
    const { category, limit } = req.body;

    const [result] = await db.execute(
      "UPDATE budgets SET category = ?, `limit` = ? WHERE id = ?", // ✅ escaped `limit`
      [category, limit, id]
    );

    const updateResult = result as OkPacket;

    if (updateResult.affectedRows === 0) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json({ message: "Budget updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating budget", error });
  }
};

// Delete a budget
export const deleteBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await db.execute("DELETE FROM budgets WHERE id = ?", [id]);

    const deleteResult = result as OkPacket;

    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error });
  }
};
