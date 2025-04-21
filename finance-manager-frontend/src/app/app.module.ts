import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Your Components
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { BudgetFormComponent } from './components/budget-form/budget-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BudgetListComponent } from './components/budget/budget-list/budget-list.component';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
import { AnalysisComponent } from './pages/analysis-page/analysis-page.component'; // Analysis page component
import { SavingsGoalComponent } from './pages/savings-goal-page/savings-goal-page.component'; // Corrected import for SavingsGoalComponent

// Angular Material Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker'; // For datepicker
import { MatNativeDateModule } from '@angular/material/core'; // For native date support
import { MatProgressBarModule } from '@angular/material/progress-bar'; // For progress bars
import { MatIconModule } from '@angular/material/icon'; // FIX: mat-icon support

import { MaterialModule } from 'material.module'; 
import { HttpClientModule } from '@angular/common/http';

// Chart.js Modules
import { NgChartsModule } from 'ng2-charts'; // Chart.js via ng2-charts

@NgModule({
  declarations: [
    AppComponent,
    ExpenseFormComponent,
    BudgetFormComponent,
    DashboardComponent,
    BudgetListComponent,
    ExpensesPageComponent,
    AnalysisComponent,
    SavingsGoalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MaterialModule,
    HttpClientModule,
    MatDatepickerModule, // For datepicker support
    MatNativeDateModule, // To use native JS Date object
    MatProgressBarModule, // To enable mat-progress-bar
    NgChartsModule, // Chart.js via ng2-charts
    MatIconModule //  fix for <mat-icon> support
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
