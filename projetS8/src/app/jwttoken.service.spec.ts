import { TestBed } from '@angular/core/testing';

import { JWTtokenService } from './jwttoken.service';

describe('JWTtokenService', () => {
  let service: JWTtokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JWTtokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
