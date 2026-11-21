import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { MatchDetails, MatchResultUpdate } from '../interfaces/MatchDetails';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/matches`;

  getMatchDetails(matchId: number): Observable<MatchDetails> {
    return this.http.get<MatchDetails>(`${this.url}/${matchId}`);
  }

  updateResult(matchId: number, result: MatchResultUpdate): Observable<void> {
    return this.http.patch<void>(`${this.url}/${matchId}`, result);
  }
}
