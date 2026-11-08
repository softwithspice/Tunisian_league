import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherJoueurs } from './afficher-joueurs';

describe('AfficherJoueurs', () => {
  let component: AfficherJoueurs;
  let fixture: ComponentFixture<AfficherJoueurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherJoueurs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherJoueurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
