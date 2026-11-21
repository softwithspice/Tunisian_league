import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DonneesService } from './donnees';

describe('DonneesService', () => {
  let service: DonneesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonneesService);
  });

  it('assigns a new club ID and resolves its name', () => {
    service.ajouterClub({ nom: 'Club Test', ville: 'Tunis', stade: 'Stade Test', dateCreation: '2026-01-01' });
    const added = service.clubs.find(club => club.nom === 'Club Test');
    expect(added?.id).toBe(4);
    expect(service.nomClub(added!.id)).toBe('Club Test');
  });

  it('counts players assigned to a club', () => {
    const before = service.effectif(1);
    service.ajouterJoueur({ nom: 'Test', prenom: 'Player', dateNaissance: '2000-01-01',
      poste: 'ATTAQUANT', nationalite: 'Tunisienne', clubId: 1 });
    expect(service.effectif(1)).toBe(before + 1);
    expect(service.effectif(2)).toBe(1);
  });
});
