import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Championnats } from './championnats';

describe('Championnats', () => {
  let component: Championnats;
  let fixture: ComponentFixture<Championnats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Championnats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Championnats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
