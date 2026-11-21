import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api-config';
import { ResponsableClubService } from './responsable-club';

describe('ResponsableClubService', () => {
  let service: ResponsableClubService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ResponsableClubService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends a club manager to the backend and returns the saved ID', () => {
    const manager = { nom: 'Ben Ali', prenom: 'Sami', email: 'sami@example.com', telephone: '20123456', clubId: 7 };
    service.addResponsable(manager).subscribe(saved => expect(saved.id).toBe(42));

    const request = http.expectOne(`${API_BASE_URL}/responsables`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(manager);
    request.flush({ ...manager, id: 42 });
  });
});
