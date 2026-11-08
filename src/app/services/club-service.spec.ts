import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ClubService } from './club-service';
import { JoueurInterface } from '../interfaces/JoueursInterface';

describe('ClubService', () => {
  let service: ClubService;
  let httpMock: HttpTestingController;

  const joueurs: JoueurInterface[] = [
    { id: 10, nom: 'Msakni', prenom: 'Youssef', dateNaissance: '1990-10-28', poste: 'ATTAQUANT', nationalite: 'Tunisienne', clubId: 1 },
    { id: 11, nom: 'Ben Romdhane', prenom: 'Mohamed', dateNaissance: '1999-09-06', poste: 'MILIEU', nationalite: 'Tunisienne', clubId: 1 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJoueursByClub (GET /clubs/{clubId}/joueurs)', () => {
    it('envoie un GET sur /clubs/{clubId}/joueurs et renvoie les joueurs', () => {
      let resultat: JoueurInterface[] | undefined;

      service.getJoueursByClub(1).subscribe((liste) => (resultat = liste));

      const req = httpMock.expectOne((r) => r.url.endsWith('/clubs/1/joueurs'));
      expect(req.request.method).toBe('GET');
      expect(req.request.body).toBeNull();
      req.flush(joueurs);

      expect(resultat).toEqual(joueurs);
    });

    it('utilise le clubId passe en parametre dans l\'URL', () => {
      service.getJoueursByClub(42).subscribe();

      const req = httpMock.expectOne((r) => r.url.endsWith('/clubs/42/joueurs'));
      req.flush([]);
    });

    it('renvoie une liste vide quand le club n\'a pas de joueurs', () => {
      let resultat: JoueurInterface[] | undefined;

      service.getJoueursByClub(2).subscribe((liste) => (resultat = liste));
      httpMock.expectOne((r) => r.url.endsWith('/clubs/2/joueurs')).flush([]);

      expect(resultat).toEqual([]);
    });

    it('transmet l\'erreur 404 quand le club n\'existe pas', () => {
      let status: number | undefined;

      service.getJoueursByClub(99).subscribe({ error: (err) => (status = err.status) });
      httpMock
        .expectOne((r) => r.url.endsWith('/clubs/99/joueurs'))
        .flush(null, { status: 404, statusText: 'Not Found' });

      expect(status).toBe(404);
    });
  });
});
