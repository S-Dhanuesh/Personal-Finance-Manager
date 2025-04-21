import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { BudgetService } from '../../services/budget.service';
import { Expense } from 'models/expense.model';
import { Budget } from 'models/budget.model';
import dayjs from 'dayjs';
import { ChartOptions, ChartData } from 'chart.js'; 

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  budgets: Budget[] = [];
  alertedCategories: Set<string> = new Set();

  chartLabels: string[] = [];
  chartData: number[] = [];

  currentMonth: string = dayjs().format('YYYY-MM');

  //  Savings Goal State
  savingsGoal: number = 0;
  totalBudgetThisMonth: number = 0;
  totalSpentThisMonth: number = 0;

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.loadAlertedCategoriesFromStorage();
    this.loadSavingsGoal(); 
    this.loadExpensesAndBudgets();
  }

  loadAlertedCategoriesFromStorage() {
    const data = sessionStorage.getItem('alertedCategories');
    if (data) {
      this.alertedCategories = new Set(JSON.parse(data));
    }
  }

  saveAlertedCategoriesToStorage() {
    sessionStorage.setItem(
      'alertedCategories',
      JSON.stringify(Array.from(this.alertedCategories))
    );
  }

  loadExpensesAndBudgets() {
    this.expenseService.getExpenses().subscribe((expenses) => {
      this.expenses = expenses;
      this.budgetService.getBudgets().subscribe((budgets) => {
        this.budgets = budgets;
        this.checkForExceededBudgets();
        this.prepareChartData();
        this.updatePieChart();
        this.calculateSavings(); 
      });
    });
  }

  normalizeCategory(category: string): string {
    return category.trim().toLowerCase();
  }

  getTotalSpent(category: string, month: string): number {
    const normalizedCategory = this.normalizeCategory(category);
    return this.expenses
      .filter(
        (exp) =>
          this.normalizeCategory(exp.category) === normalizedCategory &&
          dayjs(exp.date).format('YYYY-MM') === month
      )
      .reduce((total, exp) => total + Number(exp.amount), 0);
  }

  getBudgetUsage(category: string, month: string): number {
    const totalSpent = this.getTotalSpent(category, month);
    const budget = this.budgets.find(
      (b) =>
        this.normalizeCategory(b.category) === this.normalizeCategory(category) &&
        b.month === month
    );
    return budget && budget.limit > 0
      ? Math.min((totalSpent / budget.limit) * 100, 100)
      : 0;
  }

  checkForExceededBudgets() {
    for (const budget of this.budgets) {
      const cat = this.normalizeCategory(budget.category);
      const month = budget.month;
      const totalSpent = this.getTotalSpent(cat, month);
      const usagePercentage = (totalSpent / budget.limit) * 100;

      const alertKey = `${cat}-${month}`;
      if (usagePercentage >= 100 && !this.alertedCategories.has(alertKey)) {
        alert(`🚨 You have exceeded your budget for ${budget.category} (${month})!`);
        this.alertedCategories.add(alertKey);
      } else if (usagePercentage >= 80 && !this.alertedCategories.has(alertKey)) {
        alert(`⚠️ Warning: You have used ${usagePercentage.toFixed(0)}% of your budget for ${budget.category} (${month}).`);
        this.alertedCategories.add(alertKey);
      }
    }

    this.saveAlertedCategoriesToStorage();
  }

  prepareChartData() {
    const categoryMap: { [category: string]: number } = {};

    for (const expense of this.expenses) {
      const cat = this.normalizeCategory(expense.category);
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(expense.amount);
    }

    this.chartLabels = Object.keys(categoryMap);
    this.chartData = Object.values(categoryMap);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      groceries: '🛒',
      transport: '🚌',
      food: '🍔',
      entertainment: '🎮',
      utilities: '💡',
      rent: '🏠',
      phone: '📱',
      travel: '✈️',
      shopping: '🛍️',
    };
    const key = this.normalizeCategory(category);
    return icons[key] || '💰';
  }

  getBudgetStatus(budget: Budget): string {
    const spent = this.getTotalSpent(budget.category, budget.month);
    const usage = (spent / budget.limit) * 100;
    if (usage >= 100) return 'exceeded';
    if (usage >= 80) return 'warning';
    return 'normal';
  }

  getBudgetStatusLabel(budget: Budget): string {
    const status = this.getBudgetStatus(budget);
    switch (status) {
      case 'exceeded':
        return '🚨 Exceeded';
      case 'warning':
        return '⚠️ 80%+';
      default:
        return '✅ OK';
    }
  }

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#37474f',
          font: { size: 14, weight: 'bold' },
          boxWidth: 16,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#263238',
        titleColor: '#ffffff',
        bodyColor: '#eeeeee',
        padding: 10,
        cornerRadius: 8
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#4fc3f7', '#81c784', '#ffb74d',
          '#e57373', '#ba68c8', '#64b5f6'
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 12
      }
    ]
  };

  updatePieChart() {
    this.pieChartData.labels = this.chartLabels;
    this.pieChartData.datasets[0].data = this.chartData;
  }

  // SAVINGS GOAL TRACKER METHODS

  loadSavingsGoal() {
    const goal = localStorage.getItem('savingsGoal');
    this.savingsGoal = goal ? Number(goal) : 0;
  }

  saveSavingsGoal() {
    localStorage.setItem('savingsGoal', String(this.savingsGoal));
  }

  calculateSavings() {
    const currentMonth = this.currentMonth;

    this.totalBudgetThisMonth = this.budgets
      .filter(b => b.month === currentMonth)
      .reduce((sum, b) => sum + b.limit, 0);

    this.totalSpentThisMonth = this.expenses
      .filter(e => e.date.slice(0, 7) === currentMonth)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }
}
