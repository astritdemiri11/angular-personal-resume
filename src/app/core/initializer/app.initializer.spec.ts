import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { AppInitializer } from './app.initializer';

describe('AppInitializer', () => {
  let service: AppInitializer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    service = TestBed.inject(AppInitializer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
