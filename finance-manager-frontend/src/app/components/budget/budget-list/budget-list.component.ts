import { Component, OnInit } from '@angular/core';
import { BudgetService } from 'app/services/budget.service';
import { Budget } from 'models/budget.model';

@Component({
  selector: 'app-budget-list',
  standalone: false,
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css'],
})
export class BudgetListComponent implements OnInit {
  budgets: Budget[] = [];
  selectedMonth: string = ''; // e.g., "2024-05"
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // Months list for filtering

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.fetchBudgets();
  }

  fetchBudgets(): void {
    this.budgetService.getBudgets().subscribe((data) => {
      this.budgets = data;
    });
  }

  get filteredBudgets(): Budget[] {
    if (!this.selectedMonth) return this.budgets;
    return this.budgets.filter(b => b.month === this.selectedMonth);
  }

  deleteBudget(id: number) {
    this.budgetService.deleteBudget(id).subscribe(() => {
      this.budgets = this.budgets.filter(b => b.id !== id);
    });
  }

  // Method to handle month change
  onMonthChange(month: string): void {
    this.selectedMonth = month;
  }
}
