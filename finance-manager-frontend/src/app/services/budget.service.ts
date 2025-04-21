import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from '@models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:5000/api/budgets';

  constructor(private http: HttpClient) {}

  // GET: All budgets
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  // POST: Create new budget (includes month)
  createBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  // DELETE: Remove budget by ID
  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  //Budget exceed check
  checkIfBudgetExceeded(expenses: any[], budgets: any[]): void {
    const categoryTotals: { [category: string]: number } = {};

    for (const expense of expenses) {
      const category = expense.category;
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += expense.amount;
    }

    for (const budget of budgets) {
      const totalSpent = categoryTotals[budget.category] || 0;
      if (totalSpent > budget.limit) {
        alert(`⚠️ You have exceeded your budget for ${budget.category}!`);
      }
    }
  }
}


