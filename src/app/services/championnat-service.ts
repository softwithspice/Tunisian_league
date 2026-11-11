import { API_BASE_URL } from '../api-config';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChampionnatInterface } from '../interfaces/ChampionnatInterface';
import { Match } from '../interfaces/Match';
import { CalendarMatch } from '../interfaces/CalendarMatch';


@Injectable({ providedIn: 'root' })
export class ChampionnatService {
  private readonly http = inject(HttpClient);

  // ⚠️ à confirmer dans Swagger (POST /championnats ?)
  private readonly url = `${API_BASE_URL}/championnats`;

  addChampionnat(championnat: ChampionnatInterface): Observable<ChampionnatInterface> {
    return this.http.post<ChampionnatInterface>(this.url, championnat);
  }

  getChampionnats(): Observable<ChampionnatInterface[]> { return this.http.get<ChampionnatInterface[]>(this.url); }
  getMatches(id: number, page: number): Observable<{ content: CalendarMatch[]; page: number; size: number; hasNext: boolean }> {
    return this.http.get<{ content: CalendarMatch[]; page: number; size: number; hasNext: boolean }>(`${this.url}/${id}/matches`, { params: { page, size: 20 } });
  }
  saisirJournee(matches: Match[]): Observable<void> { return this.http.post<void>(`${API_BASE_URL}/journees`, matches); }
}
