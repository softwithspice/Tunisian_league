import { ComponentFixture, TestBed } from '@angular/core/testing';

import { REGISTER } from './register';

describe('REGISTER', () => {
  let component: REGISTER;
  let fixture: ComponentFixture<REGISTER>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [REGISTER]
    })
    .compileComponents();

    fixture = TestBed.createComponent(REGISTER);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
