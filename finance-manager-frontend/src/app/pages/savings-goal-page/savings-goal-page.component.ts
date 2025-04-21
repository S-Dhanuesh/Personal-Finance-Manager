import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { ExpenseService } from '../../services/expense.service';
import { Budget } from 'models/budget.model';
import { Expense } from 'models/expense.model';
import dayjs from 'dayjs';

@Component({
  selector: 'app-savings-goal',
  standalone: false,
  templateUrl: './savings-goal-page.component.html',
  styleUrls: ['./savings-goal-page.component.css']
})
export class SavingsGoalComponent implements OnInit {
  currentMonth = dayjs().format('YYYY-MM');
  goalAmount: number = 5000; // Default goal

  budgets: Budget[] = [];
  expenses: Expense[] = [];

  totalBudget: number = 0;
  totalExpenses: number = 0;
  savings: number = 0;
  progress: number = 0;

  constructor(
    private budgetService: BudgetService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.budgetService.getBudgets().subscribe((budgets) => {
      this.budgets = budgets.filter(b => b.month === this.currentMonth);
      this.totalBudget = this.budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);

      this.expenseService.getExpenses().subscribe((expenses) => {
        this.expenses = expenses.filter(e => dayjs(e.date).format('YYYY-MM') === this.currentMonth);
        this.totalExpenses = this.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

        this.savings = Math.max(this.totalBudget - this.totalExpenses, 0);
        this.progress = this.goalAmount > 0
          ? Math.min((this.savings / this.goalAmount) * 100, 100)
          : 0;
      });
    });
  }

  getSavingsProgress(): number {
    return this.progress;
  }

  getProgressColor(): string {
    if (this.progress >= 75) return 'primary';
    if (this.progress >= 50) return 'accent';
    return 'warn';
  }

  getMotivationMessage(): string {
    if (this.savings >= this.goalAmount) return '🎉 Goal Achieved! Keep saving!';
    if (this.progress >= 75) return '💪 Almost there!';
    if (this.progress >= 50) return '👏 Halfway to your savings goal!';
    return '🚀 Keep going, you can do it!';
  }

  saveGoal() {
    console.log('✅ Savings goal set:', this.goalAmount);
    this.loadData(); // Refresh after saving goal
  }
}
