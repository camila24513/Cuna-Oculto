import { TestBed } from '@angular/core/testing';
import { Sightengine } from './sightengine';

describe('Sightengine', () => {
  let service: Sightengine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sightengine);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
