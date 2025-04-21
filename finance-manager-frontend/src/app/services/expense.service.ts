import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5000/api/expenses';

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  addExpense(expense: Expense): Observable<any> {
    return this.http.post(this.apiUrl, expense);
  }

  //  Add this method to enable deleting
  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
