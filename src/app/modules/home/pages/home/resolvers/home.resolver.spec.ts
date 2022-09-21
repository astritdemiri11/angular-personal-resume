import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { HomeResolver } from './home.resolver';

describe('HomeResolver', () => {
  let resolver: HomeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    resolver = TestBed.inject(HomeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
