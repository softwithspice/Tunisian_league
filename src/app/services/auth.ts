import { Injectable,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';
import { LoginRequest } from '../interfaces/login-request';



@Injectable({
  providedIn: 'root',
})

export class AuthService {
  
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/auth';

  login(email: string, motDePasse: string): Observable<LoginResponse> {

    const request: LoginRequest = {
      email,
      motDePasse
    };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }

changerMotDePasse(
  nouveauMotDePasse: string,
  confirmationMotDePasse: string
): Observable<void> {

  const token = sessionStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.put<void>(
    `${this.apiUrl}/changer-mot-de-passe`,
    {
      nouveauMotDePasse,
      confirmationMotDePasse
    },
    { headers }
  );
}

}
