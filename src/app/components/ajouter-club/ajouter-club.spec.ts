import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterClub } from './ajouter-club';

describe('AjouterClub', () => {
  let component: AjouterClub;
  let fixture: ComponentFixture<AjouterClub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterClub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterClub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
