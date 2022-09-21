import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
