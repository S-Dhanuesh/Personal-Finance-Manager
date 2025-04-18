import { Request, Response } from "express";
import { RowDataPacket, OkPacket } from "mysql2";
import db from "../config/database";
import { Expense } from "../models/expenseModel";

// ✅ NEW: CSV Export Library
import { Parser } from 'json2csv';

// Get all expenses
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute("SELECT * FROM expenses ORDER BY date DESC");
    const expenses = rows as Expense[];
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

// ✅ NEW: Export Expenses as CSV
export const exportExpensesAsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute("SELECT * FROM expenses ORDER BY date DESC");
    const expenses = rows as Expense[];

    const parser = new Parser();
    const csv = parser.parse(expenses);

    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error exporting expenses", error });
  }
};

// Add a new expense
export const addExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, amount, category, date } = req.body;

    const [result] = await db.execute(
      "INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)",
      [title, amount, category, date]
    );

    const insertResult = result as OkPacket;

    if (insertResult.affectedRows > 0) {
      res.status(201).json({
        message: "Expense added successfully",
        id: insertResult.insertId,
      });
    } else {
      res.status(500).json({ message: "Failed to add expense" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
};

// Get an expense by ID
export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM expenses WHERE id = ?", [id]);
    const expenses = rows as Expense[];

    if (expenses.length === 0) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json(expenses[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense details", error });
  }
};

// Update an expense
export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    const [result] = await db.execute(
      "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?",
      [title, amount, category, date, id]
    );

    const updateResult = result as OkPacket;

    if (updateResult.affectedRows === 0) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json({ message: "Expense updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};

// Delete an expense
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await db.execute("DELETE FROM expenses WHERE id = ?", [id]);

    const deleteResult = result as OkPacket;

    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
