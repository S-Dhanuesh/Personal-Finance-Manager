import { Component } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { Budget } from 'models/budget.model';

@Component({
  selector: 'app-budget-form',
  standalone: false,
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent {
  budget: Omit<Budget, 'id'> = {
    category: '',
    limit: 0,
    month: ''  // Added the 'month' property to the budget object
  };

  constructor(private budgetService: BudgetService) {}

  onSubmit() {
    console.log('Add Budget button clicked!', this.budget); //  Debug log
    this.budgetService.createBudget(this.budget).subscribe(() => {
      alert('Budget created!');
      this.budget = { category: '', limit: 0, month: '' }; // reset form, including 'month'
    });
  }
}
