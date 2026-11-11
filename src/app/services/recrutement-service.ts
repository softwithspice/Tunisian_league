import { API_BASE_URL } from '../api-config';

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../interfaces/JoueursInterface';
import { DemandeRecrutementInterface } from '../interfaces/Demande_recrutement';

@Injectable({ providedIn: 'root' })
export class RecrutementService {

  private http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}`;
  private readonly urlDemandes = `${this.apiUrl}/recrutement`;

  // Récupérer les joueurs disponibles pour le responsable
  getJoueurs(): Observable<JoueurInterface[]> {
    return this.http.get<JoueurInterface[]>(
      `${this.apiUrl}/joueurs/disponibles`
    );
  }

  // Envoyer une demande : seul le joueurId est nécessaire
  envoyerDemande(joueurId: number): Observable<void> {
    return this.http.post<void>(
      this.urlDemandes,
      { joueurId }
    );
  }

  // Toutes les demandes : ADMIN
  getDemandes(): Observable<DemandeRecrutementInterface[]> {
    return this.http.get<DemandeRecrutementInterface[]>(
      this.urlDemandes
    );
  }

  // Demandes du responsable connecté
  getMesDemandes(): Observable<DemandeRecrutementInterface[]> {
    return this.http.get<DemandeRecrutementInterface[]>(
      `${this.urlDemandes}/mes-demandes`
    );
  }

  // Accepter une demande : ADMIN
  accepterDemande(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.urlDemandes}/${id}/accepter`, {}
    );
  }

  // Refuser une demande : ADMIN
  refuserDemande(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.urlDemandes}/${id}/refuser`, {}
    );
  }
}
