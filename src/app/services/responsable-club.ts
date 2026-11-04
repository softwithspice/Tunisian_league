import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsableClubInterface } from '../interfaces/ResponsableClub';

@Injectable({ providedIn: 'root' })
export class ResponsableClubService {
  private readonly http = inject(HttpClient);

  // ⚠️ à confirmer dans Swagger (chemin exact du POST)
  private readonly url = 'http://localhost:8080/responsables';

  addResponsable(responsable: ResponsableClubInterface): Observable<ResponsableClubInterface> {
    return this.http.post<ResponsableClubInterface>(this.url, responsable);
  }
}