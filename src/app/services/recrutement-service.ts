import { Injectable ,inject} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../interfaces/JoueursInterface';
import { DemandeRecrutementInterface } from '../interfaces/Demande_recrutement';


@Injectable({ providedIn: 'root' })
export class RecrutementService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080';

  getJoueurs(): Observable<JoueurInterface[]> {
    return this.http.get<JoueurInterface[]>(`${this.apiUrl}/joueurs`);
  }

  envoyerDemande(demande: DemandeRecrutementInterface): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/recrutement`, demande);
  }

private readonly urlDemandes = 'http://localhost:8080/recrutement';

getDemandes(): Observable<DemandeRecrutementInterface[]> {
  return this.http.get<DemandeRecrutementInterface[]>(this.urlDemandes);
}

accepterDemande(id: number): Observable<void> {
  return this.http.put<void>(`${this.urlDemandes}/${id}/accepter`, {});
}

refuserDemande(id: number): Observable<void> {
  return this.http.put<void>(`${this.urlDemandes}/${id}/refuser`, {});
}
getMesDemandes(responsableId: number): Observable<DemandeRecrutementInterface[]> {
  return this.http.get<DemandeRecrutementInterface[]>(
    `${this.urlDemandes}/responsable/${responsableId}`,
  );
}
}