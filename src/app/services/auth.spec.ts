import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../api-config';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('submits login credentials and returns the admin role and token', () => {
    const response = { token: 'test-token', id: null, nom: null, prenom: null,
      email: 'admin@example.com', clubId: null, motDePasseProvisoire: false, role: 'ADMIN' as const };
    service.login('admin@example.com', 'test-password').subscribe(result => expect(result).toEqual(response));

    const request = http.expectOne(`${API_BASE_URL}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'admin@example.com', motDePasse: 'test-password' });
    request.flush(response);
  });

  it('propagates a failed login', () => {
    let status: number | undefined;
    service.login('admin@example.com', 'wrong').subscribe({ error: error => status = error.status });
    http.expectOne(`${API_BASE_URL}/auth/login`).flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401);
  });
});
