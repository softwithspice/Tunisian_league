import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRecrutement } from './demande-recrutement';

describe('DemandeRecrutement', () => {
  let component: DemandeRecrutement;
  let fixture: ComponentFixture<DemandeRecrutement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeRecrutement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeRecrutement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
