import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChampionnatInterface } from '../interfaces/ChampionnatInterface';


@Injectable({ providedIn: 'root' })
export class ChampionnatService {
  private readonly http = inject(HttpClient);

  // ⚠️ à confirmer dans Swagger (POST /championnats ?)
  private readonly url = 'http://localhost:8080/championnats';

  addChampionnat(championnat: ChampionnatInterface): Observable<ChampionnatInterface> {
    return this.http.post<ChampionnatInterface>(this.url, championnat);
  }
}