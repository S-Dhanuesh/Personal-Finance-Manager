import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsGoalPageComponent } from './savings-goal-page.component';

describe('SavingsGoalPageComponent', () => {
  let component: SavingsGoalPageComponent;
  let fixture: ComponentFixture<SavingsGoalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingsGoalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsGoalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
