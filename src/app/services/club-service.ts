import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClubInterface } from '../interfaces/ClubInterface';


@Injectable({ providedIn: 'root' })
export class ClubService {
  private readonly http = inject(HttpClient);

  // ⚠️ à confirmer avec ton ClubController (@RequestMapping)
  private readonly url = 'http://localhost:8080/clubs';

  addClub(club: ClubInterface): Observable<ClubInterface> {
    return this.http.post<ClubInterface>(this.url, club);
  }

  getClubs(): Observable<ClubInterface[]> {
    return this.http.get<ClubInterface[]>(this.url);
  }
}