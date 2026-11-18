import { API_BASE_URL } from '../api-config';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserve } from '../interfaces/Reserve';
import { Match } from '../interfaces/Match';

@Injectable({ providedIn: 'root' })
export class ReserveService {

  private http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/reserve`;

  deposerReserve(matchId: number, motif: string): Observable<Reserve> {
    return this.http.post<Reserve>(this.url, {
      matchId,
      motif
    });
  }

  getMesMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.url}/matches`);
  }
}