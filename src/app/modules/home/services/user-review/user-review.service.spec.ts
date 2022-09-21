import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { UserReviewService } from './user-review.service';

describe('UserReviewService', () => {
  let service: UserReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    service = TestBed.inject(UserReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
