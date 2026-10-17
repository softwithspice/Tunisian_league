import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sanctions } from './sanctions';

describe('Sanctions', () => {
  let component: Sanctions;
  let fixture: ComponentFixture<Sanctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sanctions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sanctions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
