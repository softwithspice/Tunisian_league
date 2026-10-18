  import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../interfaces/JoueursInterface';

@Injectable({
  providedIn: 'root',
})



export class JoueurService {
  private readonly http = inject(HttpClient);

  // ⚠️ à confirmer dans Swagger (POST /joueurs ?)
  private readonly url = 'http://localhost:8080/joueurs';

  addJoueur(joueur: JoueurInterface): Observable<JoueurInterface> {
    return this.http.post<JoueurInterface>(this.url, joueur);
  }

  getJoueurs(): Observable<JoueurInterface[]> {
    return this.http.get<JoueurInterface[]>(this.url);
  }
}
