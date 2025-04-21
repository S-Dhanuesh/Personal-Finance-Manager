import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { BudgetService } from '../../services/budget.service';
import { Budget } from 'models/budget.model';
import { Expense } from 'models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: false,
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
})
export class ExpenseFormComponent implements OnInit {
  @Output() expenseAdded = new EventEmitter<void>();

  expense: Omit<Expense, 'id'> = {
    title: '',
    amount: 0,
    category: '',
    date: ''
  };

  budgets: Budget[] = [];
  warningMessage: string = '';

  //  Receipt image preview (base64)
  receiptPreview: string | null = null;

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    this.budgetService.getBudgets().subscribe((budgets) => {
      this.budgets = budgets;
    });
  }

  submitExpense() {
    this.warningMessage = '';

    debugger; // Set a breakpoint here during testing

    const category = this.expense.category.trim().toLowerCase();
    const expenseMonth = this.expense.date.slice(0, 7); // Extract YYYY-MM

    const matchingBudget = this.budgets.find(
      (b) =>
        b.category.trim().toLowerCase() === category &&
        b.month === expenseMonth
    );

    if (matchingBudget) {
      this.expenseService.getExpenses().subscribe((expenses) => {
        const total = expenses
          .filter(
            (e) =>
              e.category.trim().toLowerCase() === category &&
              e.date.slice(0, 7) === expenseMonth
          )
          .reduce((sum, e) => sum + Number(e.amount), 0) + this.expense.amount;

        const limit = matchingBudget.limit;
        const eightyPercent = limit * 0.8;

        if (total > limit) {
          this.warningMessage = `🚨 Budget Exceeded for "${matchingBudget.category}" in ${matchingBudget.month}: ₹${total} / ₹${limit}`;
          alert(this.warningMessage);
        } else if (total >= eightyPercent) {
          this.warningMessage = `⚠️ Warning: You've spent over 80% of your budget for "${matchingBudget.category}" in ${matchingBudget.month}: ₹${total} / ₹${limit}`;
          alert(this.warningMessage);
        }

        this.saveExpense();
      });
    } else {
      //  Non-blocking warning if no budget is set for that month
      this.warningMessage = `⚠️ No budget set for "${this.expense.category}" in ${expenseMonth}. This expense will be added without budget tracking.`;
      alert(this.warningMessage);

      this.saveExpense();
    }
  }

  saveExpense() {
    this.expenseService.addExpense(this.expense).subscribe({
      next: () => {
        this.expenseAdded.emit();
        this.expense = { title: '', amount: 0, category: '', date: '' };
        this.receiptPreview = null; // Clear image after submission
        this.warningMessage = '';
      },
      error: (err) => {
        console.error('❌ Error adding expense:', err);
        this.warningMessage = 'Failed to add expense.';
      },
    });
  }

  //  Method to handle file input and preview image
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.receiptPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
