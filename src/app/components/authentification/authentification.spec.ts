import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AUTHENTIFICATION } from './authentification';

describe('AUTHENTIFICATION', () => {
  let component: AUTHENTIFICATION;
  let fixture: ComponentFixture<AUTHENTIFICATION>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AUTHENTIFICATION]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AUTHENTIFICATION);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
