import { TestBed } from '@angular/core/testing';
import { FiltroTextoService } from './filtro-texto';

describe('FiltroTextoService', () => {
  let service: FiltroTextoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltroTextoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});