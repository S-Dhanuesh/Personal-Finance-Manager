import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'app/services/expense.service';
import { BudgetService } from 'app/services/budget.service';
import { Expense } from 'models/expense.model';

@Component({
  selector: 'app-expenses-page',
  standalone: false,
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.css']
})
export class ExpensesPageComponent implements OnInit {
  expenses: Expense[] = [];

  filters = {
    title: '',
    category: '',
    minAmount: 0,
    maxAmount: Infinity,
    startDate: null as Date | null,
    endDate: null as Date | null
  };

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(data => {
      this.expenses = data;

      this.budgetService.getBudgets().subscribe(budgets => {
        this.checkIfBudgetExceeded(this.expenses, budgets);
      });
    });
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(id).subscribe(() => {
      this.expenses = this.expenses.filter(exp => exp.id !== id);
      alert('🗑️ Expense deleted!');
    });
  }

  checkIfBudgetExceeded(expenses: Expense[], budgets: any[]): void {
    const categoryTotals: { [category: string]: number } = {};

    for (const expense of expenses) {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    }

    for (const budget of budgets) {
      const totalSpent = categoryTotals[budget.category] || 0;
      if (totalSpent > budget.limit) {
        alert(`⚠️ You have exceeded your budget for ${budget.category}!`);
      }
    }
  }

  filteredExpenses(): Expense[] {
    return this.expenses.filter(exp => {
      const matchesTitle = exp.title.toLowerCase().includes(this.filters.title.toLowerCase());
      const matchesCategory = exp.category.toLowerCase().includes(this.filters.category.toLowerCase());
      const matchesAmount = exp.amount >= this.filters.minAmount &&
                            exp.amount <= this.filters.maxAmount;
      const matchesStartDate = !this.filters.startDate || new Date(exp.date) >= new Date(this.filters.startDate);
      const matchesEndDate = !this.filters.endDate || new Date(exp.date) <= new Date(this.filters.endDate);

      return matchesTitle && matchesCategory && matchesAmount && matchesStartDate && matchesEndDate;
    });
  }

  // Add export triggers
  exportCSV() {
    window.open('http://localhost:5000/api/expenses/export/csv', '_blank');
  }

  exportPDF() {
    window.open('http://localhost:5000/api/expenses/export/pdf', '_blank');
  }
}
