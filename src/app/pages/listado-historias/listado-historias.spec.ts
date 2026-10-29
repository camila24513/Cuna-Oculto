import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoHistorias } from './listado-historias';

describe('ListadoHistorias', () => {
  let component: ListadoHistorias;
  let fixture: ComponentFixture<ListadoHistorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoHistorias],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoHistorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
