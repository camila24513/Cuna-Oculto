import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisHistorias } from './mis-historias';

describe('MisHistorias', () => {
  let component: MisHistorias;
  let fixture: ComponentFixture<MisHistorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisHistorias],
    }).compileComponents();

    fixture = TestBed.createComponent(MisHistorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
