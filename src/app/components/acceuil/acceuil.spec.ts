import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from '../../api-config';

import { Acceuil } from './acceuil';

describe('Acceuil', () => {
  let component: Acceuil;
  let fixture: ComponentFixture<Acceuil>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acceuil],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acceuil);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${API_BASE_URL}/clubs`).flush([{ id: 7, nom: 'Club Test', ville: 'Tunis' }]);
    await fixture.whenStable();
  });

  it('shows clubs from the API', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Club Test');
  });
});
