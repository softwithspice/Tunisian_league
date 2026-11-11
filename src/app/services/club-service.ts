import { API_BASE_URL } from '../api-config';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClubInterface } from '../interfaces/ClubInterface';
import { JoueurInterface } from '../interfaces/JoueursInterface';


@Injectable({ providedIn: 'root' })
export class ClubService {
  private readonly http = inject(HttpClient);

  private readonly url = `${API_BASE_URL}/clubs`;

  addClub(club: ClubInterface): Observable<ClubInterface> {
    return this.http.post<ClubInterface>(this.url, club);
  }

  getClubs(): Observable<ClubInterface[]> {
    return this.http.get<ClubInterface[]>(this.url);
  }

  getMonClub(): Observable<{ nom: string }> {
  return this.http.get<{ nom: string }>(
    `${this.url}/mon-club`
  );
}

  getJoueursByClub(clubId: number): Observable<JoueurInterface[]> {
    return this.http.get<JoueurInterface[]>(`${this.url}/${clubId}/joueurs`);
  }

}