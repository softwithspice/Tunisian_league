import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCompte } from './ajouter-compte';

describe('AjouterCompte', () => {
  let component: AjouterCompte;
  let fixture: ComponentFixture<AjouterCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
