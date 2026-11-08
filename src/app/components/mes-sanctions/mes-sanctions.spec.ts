import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MesSanctions } from './mes-sanctions';
import { SanctionInterface } from '../../interfaces/SanctionInterface';

describe('MesSanctions (GET /sanction/mes-sanctions)', () => {
  let fixture: ComponentFixture<MesSanctions>;
  let httpMock: HttpTestingController;

  const sanctions: SanctionInterface[] = [
    { id: 3, typeSanction: 'SUSPENSION', motif: 'Carton rouge direct', dateSanction: '2026-10-20', duree: 2, idJoueur: 10, idClub: null },
    { id: 2, typeSanction: 'SUSPENSION', motif: 'Insultes', dateSanction: '2026-10-01', duree: 1, idJoueur: 11, idClub: null },
    { id: 1, typeSanction: 'AVERTISSEMENT', motif: 'Retard au coup d\'envoi', dateSanction: '2026-09-15', duree: 0, idJoueur: null, idClub: 1 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesSanctions],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MesSanctions);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  async function rendu(): Promise<HTMLElement> {
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const requete = () => httpMock.expectOne((r) => r.url.endsWith('/sanction/mes-sanctions'));

  it('appelle /sanction/mes-sanctions au chargement et affiche les sanctions', async () => {
    expect(fixture.nativeElement.textContent).toContain('Chargement');

    const req = requete();
    expect(req.request.method).toBe('GET');
    req.flush(sanctions);

    const page = await rendu();
    const lignes = page.querySelectorAll('tbody tr');
    expect(lignes.length).toBe(3);
    expect(lignes[0].textContent).toContain('2026-10-20');
    expect(lignes[0].textContent).toContain('SUSPENSION');
    expect(lignes[0].textContent).toContain('Carton rouge direct');
    expect(lignes[0].textContent).toContain('2 match(s)');
  });

  it('affiche le total, les suspensions et les avertissements', async () => {
    requete().flush(sanctions);

    const page = await rendu();
    const cartes = Array.from(page.querySelectorAll('.carte strong')).map((e) => e.textContent?.trim());
    expect(cartes).toEqual(['3', '2', '1']);
  });

  it('indique si la sanction concerne un joueur ou le club', async () => {
    requete().flush(sanctions);

    const page = await rendu();
    const lignes = page.querySelectorAll('tbody tr');
    expect(lignes[0].textContent).toContain('Joueur #10');
    expect(lignes[2].textContent).toContain('Club');
    expect(lignes[2].querySelector('td.club')).not.toBeNull();
    // duree 0 -> pas de nombre de matchs
    expect(lignes[2].textContent).toContain('—');
  });

  it('affiche un message quand le club n\'a aucune sanction', async () => {
    requete().flush([]);

    const page = await rendu();
    expect(page.textContent).toContain('Aucune sanction');
    expect(page.querySelector('table')).toBeNull();
  });

  it('affiche "pas acces" quand le backend renvoie 401 (non connecte)', async () => {
    requete().flush(null, { status: 401, statusText: 'Unauthorized' });

    const page = await rendu();
    expect(page.querySelector('.erreur')?.textContent).toContain("Vous n'avez pas accès");
  });

  it('affiche "pas acces" quand le backend renvoie 403 (pas responsable)', async () => {
    requete().flush(null, { status: 403, statusText: 'Forbidden' });

    const page = await rendu();
    expect(page.querySelector('.erreur')?.textContent).toContain("Vous n'avez pas accès");
  });

  it('affiche une erreur quand le serveur est injoignable', async () => {
    requete().error(new ProgressEvent('error'));

    const page = await rendu();
    expect(page.querySelector('.erreur')?.textContent).toContain('Impossible de joindre le serveur');
  });

  it('le bouton Actualiser rappelle /sanction/mes-sanctions', async () => {
    requete().flush([]);
    let page = await rendu();

    (page.querySelector('.actualiser') as HTMLButtonElement).click();
    requete().flush(sanctions);

    page = await rendu();
    expect(page.querySelectorAll('tbody tr').length).toBe(3);
  });
});
