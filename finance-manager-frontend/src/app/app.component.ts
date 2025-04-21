import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'finance-manager-frontend';
  words: string[] = ['BUDGET', 'YOUR', 'MONEY', 'OWN', 'YOUR', 'LIFE'];

  ngOnInit(): void {
    // Nothing else needed, animation handled via binding
  }

  getDelay(index: number): string {
    return `${index * 0.2}s`; // delays: 0s, 0.2s, 0.4s...
  }
}
