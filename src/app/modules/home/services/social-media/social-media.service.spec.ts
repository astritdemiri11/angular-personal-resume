import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { SocialMediaService } from './social-media.service';

describe('SocialMediaService', () => {
  let service: SocialMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    service = TestBed.inject(SocialMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
