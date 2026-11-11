import { API_BASE_URL } from '../api-config';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsableClubInterface } from '../interfaces/ResponsableClub';

@Injectable({ providedIn: 'root' })
export class ResponsableClubService {
  private readonly http = inject(HttpClient);

  // ⚠️ à confirmer dans Swagger (chemin exact du POST)
  private readonly url = `${API_BASE_URL}/responsables`;

  addResponsable(responsable: ResponsableClubInterface): Observable<ResponsableClubInterface> {
    return this.http.post<ResponsableClubInterface>(this.url, responsable);
  }
}