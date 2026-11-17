import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { Resultats } from './resultats';
import { ChampionnatService } from '../../services/championnat-service';

describe('Resultats', () => {

  let component: Resultats;
  let fixture: ComponentFixture<Resultats>;

  const matchs = [
    {
      journee: 1,
      clubDomicileId: 1,
      clubExterieurId: 2,
      clubDomicileNom: 'Club A',
      clubExterieurNom: 'Club B',
      dateMatch: '2026-11-01T00:00:00',
      butsDomicile: 2,
      butsExterieur: 1
    },
    {
      journee: 2,
      clubDomicileId: 2,
      clubExterieurId: 1,
      clubDomicileNom: 'Club B',
      clubExterieurNom: 'Club A',
      dateMatch: '2026-11-08T00:00:00',
      butsDomicile: 0,
      butsExterieur: 0
    }
  ];

  const serviceMock = {
    getChampionnats: vi.fn(),
    getResults: vi.fn()
  };

  beforeEach(async () => {

    vi.resetAllMocks();

    serviceMock.getChampionnats.mockReturnValue(of([]));

    serviceMock.getResults.mockReturnValue(of({
      content: matchs,
      page: 0,
      size: 20,
      hasNext: false
    }));

    await TestBed.configureTestingModule({
      imports: [Resultats],
      providers: [
        provideRouter([]),
        {
          provide: ChampionnatService,
          useValue: serviceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Resultats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve results for the selected championnat', () => {

    component.championnatId = 1;
    component.choisir();

    expect(serviceMock.getResults).toHaveBeenCalledWith(1, 0);
  });

  it('should display match scores', () => {

    component.championnatId = 1;
    component.choisir();

    fixture.detectChanges();

    const html = fixture.nativeElement.textContent;

    expect(html).toContain('2 - 1');
    expect(html).toContain('0 - 0');
  });

  it('should retrieve the requested page', () => {

    component.championnatId = 1;
    component.choisir(1);

    expect(serviceMock.getResults).toHaveBeenCalledWith(1, 1);
  });

  it('should handle empty results', () => {

    serviceMock.getResults.mockReturnValue(of({
      content: [],
      page: 0,
      size: 20,
      hasNext: false
    }));

    component.championnatId = 1;
    component.choisir();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.score').length)
      .toBe(0);
  });

  it('should handle an API error', () => {

    serviceMock.getResults.mockReturnValue(
      throwError(() => new Error('Erreur serveur'))
    );

    component.championnatId = 1;
    component.choisir();

    expect(component.loading).toBe(false);
    expect(component.erreur).toBeTruthy();
  });

});