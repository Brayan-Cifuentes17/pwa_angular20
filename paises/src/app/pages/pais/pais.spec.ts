import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pais } from './pais';

describe('Pais', () => {
  let component: Pais;
  let fixture: ComponentFixture<Pais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pais],
    }).compileComponents();

    fixture = TestBed.createComponent(Pais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
