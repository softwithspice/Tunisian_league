import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ClubJoueurs } from './club-joueurs';
import { ClubInterface } from '../../interfaces/ClubInterface';
import { JoueurInterface } from '../../interfaces/JoueursInterface';

describe('ClubJoueurs (GET /clubs/{clubId}/joueurs)', () => {
  let fixture: ComponentFixture<ClubJoueurs>;
  let httpMock: HttpTestingController;

  const clubs: ClubInterface[] = [
    { id: 1, nom: 'Espérance Sportive de Tunis', ville: 'Tunis', stade: 'Stade de Radès' },
    { id: 2, nom: 'Club Africain', ville: 'Tunis' },
  ];

  const joueurs: JoueurInterface[] = [
    { id: 10, nom: 'Msakni', prenom: 'Youssef', dateNaissance: '1990-10-28', poste: 'ATTAQUANT', nationalite: 'Tunisienne', clubId: 1 },
    { id: 11, nom: 'Ben Romdhane', prenom: 'Mohamed', dateNaissance: '1999-09-06', poste: 'MILIEU', nationalite: 'Tunisienne', clubId: 1 },
  ];

  async function creer(clubId: string): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [ClubJoueurs],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ clubId })) } },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ClubJoueurs);
    fixture.detectChanges();
  }

  async function rendu(): Promise<HTMLElement> {
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const requeteClubs = () => httpMock.expectOne((r) => r.url.endsWith('/clubs'));
  const requeteJoueurs = (id: number) => httpMock.expectOne((r) => r.url.endsWith(`/clubs/${id}/joueurs`));

  afterEach(() => httpMock.verify());

  it('appelle /clubs/{clubId}/joueurs avec l\'id de la route et affiche les joueurs', async () => {
    await creer('1');

    expect(fixture.nativeElement.textContent).toContain('Chargement des joueurs');

    requeteClubs().flush(clubs);
    const req = requeteJoueurs(1);
    expect(req.request.method).toBe('GET');
    req.flush(joueurs);

    const page = await rendu();
    expect(page.querySelector('h1')?.textContent).toContain('Espérance Sportive de Tunis');
    expect(page.textContent).toContain('2 joueur(s)');

    const lignes = page.querySelectorAll('tbody tr');
    expect(lignes.length).toBe(2);
    expect(lignes[0].textContent).toContain('Youssef Msakni');
    expect(lignes[0].textContent).toContain('ATTAQUANT');
    expect(lignes[1].textContent).toContain('Mohamed Ben Romdhane');
  });

  it('affiche un message quand le club n\'a aucun joueur', async () => {
    await creer('2');

    requeteClubs().flush(clubs);
    requeteJoueurs(2).flush([]);

    const page = await rendu();
    expect(page.textContent).toContain('Aucun joueur dans ce club');
    expect(page.querySelector('table')).toBeNull();
  });

  it('affiche "Club introuvable" quand le backend renvoie 404', async () => {
    await creer('99');

    requeteClubs().flush(clubs);
    requeteJoueurs(99).flush(null, { status: 404, statusText: 'Not Found' });

    const page = await rendu();
    expect(page.querySelector('.erreur')?.textContent).toContain('Club introuvable');
  });

  it('affiche une erreur quand le serveur est injoignable', async () => {
    await creer('1');

    requeteClubs().error(new ProgressEvent('error'));
    requeteJoueurs(1).error(new ProgressEvent('error'));

    const page = await rendu();
    expect(page.querySelector('.erreur')?.textContent).toContain('Impossible de joindre le serveur');
  });

  it('affiche les joueurs meme si le nom du club ne peut pas etre charge', async () => {
    await creer('1');

    requeteClubs().flush(null, { status: 500, statusText: 'Server Error' });
    requeteJoueurs(1).flush(joueurs);

    const page = await rendu();
    expect(page.querySelector('h1')?.textContent).toContain('Effectif du club');
    expect(page.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('n\'appelle pas le backend si le clubId de la route est invalide', async () => {
    await creer('abc');

    httpMock.expectNone((r) => r.url.includes('/joueurs'));

    const page = await rendu();
    expect(page.querySelector('.erreur')?.textContent).toContain('Club introuvable');
  });

  it('calcule l\'age a partir de la date de naissance', async () => {
    await creer('abc');

    const dixAnsAvant = new Date();
    dixAnsAvant.setFullYear(dixAnsAvant.getFullYear() - 10);
    dixAnsAvant.setDate(dixAnsAvant.getDate() - 1);

    expect(fixture.componentInstance.calculerAge(dixAnsAvant.toISOString().slice(0, 10))).toBe(10);
    expect(fixture.componentInstance.calculerAge('')).toBeNull();
  });
});
