import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisHistoriasComponent } from './mis-historias';
import { provideHttpClient } from '@angular/common/http';

describe('MisHistoriasComponent', () => {
  let component: MisHistoriasComponent;
  let fixture: ComponentFixture<MisHistoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisHistoriasComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisHistoriasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});