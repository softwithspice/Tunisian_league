import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DashboardAdmin } from './dashboard-admin';

describe('DashboardAdmin', () => {
  let component: DashboardAdmin;
  let fixture: ComponentFixture<DashboardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdmin],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('links to result entry', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/admin/resultats"]')).not.toBeNull();
  });
});
