import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Joueurs } from './joueurs';

describe('Joueurs', () => {
  let component: Joueurs;
  let fixture: ComponentFixture<Joueurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Joueurs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Joueurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
