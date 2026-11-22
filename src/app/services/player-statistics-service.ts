import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { PlayerStatistics } from '../interfaces/PlayerStatistics';

@Injectable({ providedIn: 'root' })
export class PlayerStatisticsService {
  private readonly http = inject(HttpClient);

  getByChampionship(championshipId: number): Observable<PlayerStatistics[]> {
    return this.http.get<PlayerStatistics[]>(`${API_BASE_URL}/championnats/${championshipId}/player-statistics`);
  }
}
