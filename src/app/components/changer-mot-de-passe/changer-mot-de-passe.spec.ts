import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerMotDePasse } from './changer-mot-de-passe';

describe('ChangerMotDePasse', () => {
  let component: ChangerMotDePasse;
  let fixture: ComponentFixture<ChangerMotDePasse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangerMotDePasse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangerMotDePasse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
