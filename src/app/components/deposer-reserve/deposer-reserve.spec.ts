import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeposerReserve } from './deposer-reserve';
import { ReserveService } from '../../services/reserve-service';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('DeposerReserve', () => {

  let component: DeposerReserve;
  let fixture: ComponentFixture<DeposerReserve>;

  const reserveServiceMock = {
    getMesMatches: vi.fn(),
    deposerReserve: vi.fn()
  };

  beforeEach(async () => {

    vi.resetAllMocks();

    reserveServiceMock.getMesMatches.mockReturnValue(
      of([
        {
          id: 2,
          championnatId: 1,
          journee: 1,
          clubDomicileId: 1,
          clubExterieurId: 2,
          clubDomicileNom: 'Test',
          clubExterieurNom: 'EST',
          dateMatch: '2026-11-18'
        }
      ])
    );

    await TestBed.configureTestingModule({
      imports: [DeposerReserve],
      providers: [
        {
          provide: ReserveService,
          useValue: reserveServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeposerReserve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load club matches', () => {

    expect(component.matches().length).toBe(1);
    expect(component.matches()[0].id).toBe(2);

    expect(reserveServiceMock.getMesMatches)
      .toHaveBeenCalled();
  });

  it('should reject an empty form', () => {

    component.matchId = null;
    component.motif = '';

    component.deposerReserve();

    expect(component.erreur())
      .toBe('Veuillez remplir tous les champs.');

    expect(reserveServiceMock.deposerReserve)
      .not.toHaveBeenCalled();
  });

  it('should submit a reserve successfully', () => {

    reserveServiceMock.deposerReserve.mockReturnValue(
      of({
        id: 1,
        matchId: 2,
        motif: 'Joueur non qualifié',
        statut: 'EN_ATTENTE'
      })
    );

    component.matchId = 2;
    component.motif = 'Joueur non qualifié';

    component.deposerReserve();

    expect(reserveServiceMock.deposerReserve)
      .toHaveBeenCalledWith(2, 'Joueur non qualifié');

    expect(component.message())
      .toBe('Réserve déposée avec succès.');

    expect(component.matchId).toBeNull();
    expect(component.motif).toBe('');
  });

  it('should reject a duplicate reserve', () => {

    reserveServiceMock.deposerReserve.mockReturnValue(
      throwError(() => ({ status: 409 }))
    );

    component.matchId = 2;
    component.motif = 'Deuxième réserve';

    component.deposerReserve();

    expect(component.erreur())
      .toBe('Une réserve existe déjà pour ce match.');
  });
});