import { API_BASE_URL } from '../api-config';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SanctionInterface } from '../interfaces/SanctionInterface';


@Injectable({ providedIn: 'root' })
export class SanctionService {
  private readonly http = inject(HttpClient);


  private readonly url = `${API_BASE_URL}/sanction`;

  addSanction(sanction: SanctionInterface): Observable<SanctionInterface> {
    return this.http.post<SanctionInterface>(this.url, sanction);
  }

  getMesSanctions(): Observable<SanctionInterface[]> {
    return this.http.get<SanctionInterface[]>(`${this.url}/mes-sanctions`);
  }
}