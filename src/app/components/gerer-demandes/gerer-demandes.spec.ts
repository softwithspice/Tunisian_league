import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererDemandes } from './gerer-demandes';

describe('GererDemandes', () => {
  let component: GererDemandes;
  let fixture: ComponentFixture<GererDemandes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererDemandes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GererDemandes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
