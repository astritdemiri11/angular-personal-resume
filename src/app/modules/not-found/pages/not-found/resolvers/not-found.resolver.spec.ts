import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { NotFoundResolver } from './not-found.resolver';

describe('NotFoundResolver', () => {
  let resolver: NotFoundResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    resolver = TestBed.inject(NotFoundResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
