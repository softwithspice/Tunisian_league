import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SanctionService } from './sanction-service';
import { SanctionInterface } from '../interfaces/SanctionInterface';

describe('SanctionService', () => {
  let service: SanctionService;
  let httpMock: HttpTestingController;

  const sanctions: SanctionInterface[] = [
    { id: 2, typeSanction: 'SUSPENSION', motif: 'Carton rouge direct', dateSanction: '2026-10-20', duree: 2, idJoueur: 10, idClub: null },
    { id: 1, typeSanction: 'AVERTISSEMENT', motif: 'Retard au coup d\'envoi', dateSanction: '2026-09-15', duree: 0, idJoueur: null, idClub: 1 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SanctionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMesSanctions (GET /sanction/mes-sanctions)', () => {
    it('envoie un GET sur /sanction/mes-sanctions et renvoie les sanctions', () => {
      let resultat: SanctionInterface[] | undefined;

      service.getMesSanctions().subscribe((liste) => (resultat = liste));

      const req = httpMock.expectOne((r) => r.url.endsWith('/sanction/mes-sanctions'));
      expect(req.request.method).toBe('GET');
      expect(req.request.body).toBeNull();
      req.flush(sanctions);

      expect(resultat).toEqual(sanctions);
    });

    it('n\'envoie aucun clubId : le backend le deduit du responsable connecte', () => {
      service.getMesSanctions().subscribe();

      const req = httpMock.expectOne((r) => r.url.endsWith('/sanction/mes-sanctions'));
      expect(req.request.params.keys()).toEqual([]);
      req.flush([]);
    });

    it('renvoie une liste vide quand le club n\'a aucune sanction', () => {
      let resultat: SanctionInterface[] | undefined;

      service.getMesSanctions().subscribe((liste) => (resultat = liste));
      httpMock.expectOne((r) => r.url.endsWith('/sanction/mes-sanctions')).flush([]);

      expect(resultat).toEqual([]);
    });

    it('transmet l\'erreur 401 quand l\'utilisateur n\'est pas connecte', () => {
      let status: number | undefined;

      service.getMesSanctions().subscribe({ error: (err) => (status = err.status) });
      httpMock
        .expectOne((r) => r.url.endsWith('/sanction/mes-sanctions'))
        .flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(status).toBe(401);
    });
  });
});
