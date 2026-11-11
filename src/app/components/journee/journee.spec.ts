import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { provideRouter } from '@angular/router';
import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { EMPTY } from 'rxjs';
import { authInterceptor } from '../../interceptors/auth-interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Journee } from './journee';
import { Calendrier } from '../calendrier/calendrier';

describe('Journées et calendrier', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function initialiser() {
    http.expectOne('http://localhost:8081/championnats').flush([{ id: 1, nom: 'Ligue', saison: '2026', clubIds: [] }]);
    http.expectOne('http://localhost:8081/clubs').flush([{ id: 1, nom: 'A' }, { id: 2, nom: 'B' }]);
  }
  it('valide les clubs et soumet la liste de matchs', () => {
    const fixture = TestBed.createComponent(Journee);
    const page = fixture.componentInstance;
    initialiser(); page.championnatId = 1;
    fixture.detectChanges();
    expect(Array.from(fixture.nativeElement.querySelectorAll('fieldset select option')).map((option: any) => option.textContent.trim())).toEqual(['Choisir', 'A', 'B', 'Choisir', 'A', 'B']);
    page.matches = [{ domicile: 1, exterieur: 1, date: '2026-12-01T15:00' }];
    page.enregistrer(); expect(page.message).toContain('chaque club');
    page.matches[0].exterieur = 2; page.enregistrer();
    const request = http.expectOne('http://localhost:8081/journees');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual([{ championnatId: 1, journee: 1, clubDomicileId: 1, clubExterieurId: 2, dateMatch: '2026-12-01T15:00' }]);
    request.flush(null); expect(page.message).toContain('enregistrée');
  });
  it('trie les journées et les dates et affiche un nom de secours', () => {
    const fixture = TestBed.createComponent(Calendrier);
    const page = fixture.componentInstance;
    http.expectOne('http://localhost:8081/championnats').flush([{ id: 1, nom: 'Ligue', saison: '2026', clubIds: [] }]);
    http.expectNone('http://localhost:8081/clubs');
    page.championnatId = 1; page.choisir();
    const match = { championnatId: 1, journee: 2, clubDomicileId: 1, clubExterieurId: 9, clubDomicileNom: 'A', clubExterieurNom: null };
    http.expectOne('http://localhost:8081/championnats/1/matches?page=0&size=20').flush({ content: [{ ...match, journee: 1, dateMatch: '2026-11-01T15:00' }, { ...match, dateMatch: '2026-12-01T15:00' }, { ...match, dateMatch: '2026-12-02T15:00' }], page: 0, size: 20, hasNext: false });
    expect(page.groupes.map(g => g.journee)).toEqual(['1', '2']);
    expect(page.groupes[1].matches[0].dateMatch).toBe('2026-12-01T15:00');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('A — Club #9');
  });
  it('ignore les anciennes réponses et affiche les erreurs et le calendrier vide', () => {
    const page = TestBed.createComponent(Calendrier).componentInstance;
    http.expectOne('http://localhost:8081/championnats').flush([{ id: 1, nom: 'A' }, { id: 2, nom: 'B' }]);
    page.championnatId = 1; page.choisir();
    const old = http.expectOne('http://localhost:8081/championnats/1/matches?page=0&size=20');
    page.championnatId = 2; page.choisir();
    const current = http.expectOne('http://localhost:8081/championnats/2/matches?page=0&size=20');
    old.flush({ content: [{ journee: 1, dateMatch: '2026-01-01' }], page: 0, size: 20, hasNext: false });
    expect(page.loading).toBe(true);
    current.flush({ content: [], page: 0, size: 20, hasNext: false });
    expect(page.groupes).toEqual([]);
    page.choisir();
    http.expectOne('http://localhost:8081/championnats/2/matches?page=0&size=20').flush('Erreur', { status: 500, statusText: 'Server Error' });
    expect(page.erreur).toContain('Impossible');
    expect(page.loading).toBe(false);
  });
  it('navigue entre les pages et remet la sélection à la première page', () => {
    const fixture = TestBed.createComponent(Calendrier);
    const page = fixture.componentInstance;
    http.expectOne('http://localhost:8081/championnats').flush([{ id: 1, nom: 'A' }, { id: 2, nom: 'B' }]);
    page.championnatId = 1; page.choisir();
    const match = { journee: 1, clubDomicileId: 1, clubExterieurId: 2, clubDomicileNom: 'A', clubExterieurNom: 'B', dateMatch: '2026-01-01T15:00' };
    http.expectOne('http://localhost:8081/championnats/1/matches?page=0&size=20').flush({ content: [match], page: 0, size: 20, hasNext: true });
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.pagination button');
    expect(buttons[0].disabled).toBe(true); buttons[1].click();
    http.expectOne('http://localhost:8081/championnats/1/matches?page=1&size=20').flush({ content: [match], page: 1, size: 20, hasNext: false });
    fixture.detectChanges();
    expect(page.groupes[0].journee).toBe('1');
    expect(fixture.nativeElement.querySelectorAll('.pagination button')[1].disabled).toBe(true);
    page.championnatId = 2; page.choisir();
    http.expectOne('http://localhost:8081/championnats/2/matches?page=0&size=20').flush({ content: [], page: 0, size: 20, hasNext: false });
    expect(page.page).toBe(0);
  });
});

describe('authInterceptor', () => {
  afterEach(() => sessionStorage.removeItem('token'));
  it('ne lit pas le stockage navigateur pendant le rendu serveur', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    sessionStorage.setItem('token', 'test-token');
    let authorization: string | null = 'not-called';
    TestBed.runInInjectionContext(() => authInterceptor(new HttpRequest('GET', '/clubs'), req => {
      authorization = req.headers.get('Authorization'); return EMPTY;
    }));
    expect(authorization).toBeNull();
  });
  it('ajoute le jeton dans le navigateur', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'browser' }] });
    sessionStorage.setItem('token', 'test-token');
    let authorization: string | null = null;
    TestBed.runInInjectionContext(() => authInterceptor(new HttpRequest('GET', '/clubs'), req => {
      authorization = req.headers.get('Authorization'); return EMPTY;
    }));
    expect(authorization).toBe('Bearer test-token');
  });
});
