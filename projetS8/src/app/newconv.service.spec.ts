import { TestBed } from '@angular/core/testing';

import { NewconvService } from './newconv.service';

describe('NewconvService', () => {
  let service: NewconvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewconvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});