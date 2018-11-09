import { TestBed } from '@angular/core/testing';

import { IsochronesService } from './isochrones.service';

describe('IsochronesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsochronesService = TestBed.get(IsochronesService);
    expect(service).toBeTruthy();
  });
});
