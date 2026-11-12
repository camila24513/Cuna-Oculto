import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListadoHistoriasComponent } from './listado-historias';

describe('ListadoHistoriasComponent', () => {
  let component: ListadoHistoriasComponent;
  let fixture: ComponentFixture<ListadoHistoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoHistoriasComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoHistoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});