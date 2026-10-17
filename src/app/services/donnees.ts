import { Injectable } from '@angular/core';

export type Poste = 'GARDIEN' | 'DEFENSEUR' | 'MILIEU' | 'ATTAQUANT';
export type TypeSanction = 'AVERTISSEMENT' | 'SUSPENSION' | 'AMENDE';

export interface Club { id: number; nom: string; ville: string; stade: string; dateCreation: string; }
export interface Joueur { id: number; nom: string; prenom: string; dateNaissance: string; poste: Poste; nationalite: string; clubId: number | null; }
export interface Championnat { id: number; nom: string; saison: string; clubIds: number[]; }
export interface Sanction { id: number; type: TypeSanction; motif: string; date: string; duree: number; joueurId: number | null; clubId: number | null; }
export interface ResponsableClub { id: number; nom: string; prenom: string; email: string; telephone: string; motDePasse: string; clubId: number; }

/** Données en mémoire (front seulement). Plus tard : remplacer par des appels HttpClient. */
@Injectable({ providedIn: 'root' })
export class DonneesService {
  clubs: Club[] = [
    { id: 1, nom: 'Espérance Sportive de Tunis', ville: 'Tunis', stade: 'Stade de Radès', dateCreation: '1919-01-15' },
    { id: 2, nom: 'Club Africain', ville: 'Tunis', stade: 'Stade Hammadi Agrebi', dateCreation: '1920-10-04' },
    { id: 3, nom: 'Club Sportif Sfaxien', ville: 'Sfax', stade: 'Stade Taïeb Mhiri', dateCreation: '1928-05-02' },
  ];
  joueurs: Joueur[] = [
    { id: 1, nom: 'Ben Salah', prenom: 'Ahmed', dateNaissance: '1998-03-12', poste: 'ATTAQUANT', nationalite: 'Tunisienne', clubId: 1 },
    { id: 2, nom: 'Trabelsi', prenom: 'Karim', dateNaissance: '2000-07-21', poste: 'MILIEU', nationalite: 'Tunisienne', clubId: 2 },
  ];
  championnats: Championnat[] = [{ id: 1, nom: 'Ligue 1', saison: '2025-2026', clubIds: [1, 2, 3] }];
  sanctions: Sanction[] = [
    { id: 1, type: 'SUSPENSION', motif: 'Carton rouge direct', date: '2026-02-14', duree: 2, joueurId: 2, clubId: null },
  ];
  responsables: ResponsableClub[] = [
    { id: 1, nom: 'Gharbi', prenom: 'Mehdi', email: 'm.gharbi@club.tn', telephone: '20123456', motDePasse: '', clubId: 1 },
  ];

  private nextId(l: { id: number }[]) { return l.length ? Math.max(...l.map((x) => x.id)) + 1 : 1; }

  ajouterClub(c: Omit<Club, 'id'>) { this.clubs.push({ ...c, id: this.nextId(this.clubs) }); }
  ajouterJoueur(j: Omit<Joueur, 'id'>) { this.joueurs.push({ ...j, id: this.nextId(this.joueurs) }); }
  ajouterChampionnat(c: Omit<Championnat, 'id'>) { this.championnats.push({ ...c, id: this.nextId(this.championnats) }); }
  ajouterSanction(s: Omit<Sanction, 'id'>) { this.sanctions.push({ ...s, id: this.nextId(this.sanctions) }); }
  ajouterResponsable(r: Omit<ResponsableClub, 'id'>) { this.responsables.push({ ...r, id: this.nextId(this.responsables) }); }

  nomClub(id: number | null) { return this.clubs.find((c) => c.id === id)?.nom ?? '—'; }
  nomJoueur(id: number | null) {
    const j = this.joueurs.find((x) => x.id === id);
    return j ? `${j.prenom} ${j.nom}` : '—';
  }
  effectif(clubId: number) { return this.joueurs.filter((j) => j.clubId === clubId).length; }
}