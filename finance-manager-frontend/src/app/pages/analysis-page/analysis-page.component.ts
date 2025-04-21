import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from 'models/expense.model';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-analysis-page',
  standalone: false,
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.css']
})
export class AnalysisComponent implements OnInit {
  expenses: Expense[] = [];
  selectedMonth: string = this.getCurrentMonth(); // format: 'YYYY-MM'
  chartLabels: string[] = [];
  chartData: number[] = [];
  chartType: ChartType = 'pie';
  chartReady: boolean = false;

  // Breakdown for showing text below chart
  categoryBreakdown: { category: string, amount: number }[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe((data) => {
      this.expenses = data;
      this.updateChart();
    });
  }

  updateChart(): void {
    const filteredExpenses = this.expenses.filter(exp => exp.date.startsWith(this.selectedMonth));
    const categoryTotals: { [category: string]: number } = {};

    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    this.chartLabels = Object.keys(categoryTotals);
    this.chartData = Object.values(categoryTotals);
    this.chartReady = this.chartData.length > 0;

    this.categoryBreakdown = this.chartLabels.map((category, i) => ({
      category,
      amount: this.chartData[i]
    }));
  }

  // No longer needs event parameter
  onMonthChange(): void {
    this.updateChart();
  }
}
