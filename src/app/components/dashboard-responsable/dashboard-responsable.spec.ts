import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardResponsable } from './dashboard-responsable';

describe('DashboardResponsable', () => {
  let component: DashboardResponsable;
  let fixture: ComponentFixture<DashboardResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardResponsable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
