import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from '../../api-config';

import { DashboardResponsable } from './dashboard-responsable';

describe('DashboardResponsable', () => {
  let component: DashboardResponsable;
  let fixture: ComponentFixture<DashboardResponsable>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardResponsable],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardResponsable);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${API_BASE_URL}/clubs/mon-club`).flush({ nom: 'Club Test' });
    await fixture.whenStable();
  });

  it('shows the connected manager’s club', () => {
    expect(component).toBeTruthy();
    expect(component.nomClub()).toBe('Club Test');
  });
});
