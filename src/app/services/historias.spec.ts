import { TestBed } from '@angular/core/testing';
import { Historias } from './historias';

describe('Historias', () => {
  let service: Historias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Historias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
