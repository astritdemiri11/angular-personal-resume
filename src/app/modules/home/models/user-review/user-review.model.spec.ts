import { UserReview } from './user-review.model';

describe('UserReview', () => {
  it('should create an instance', () => {
    expect(new UserReview({ id: 0, d: '', f: '', i: '', p: '' })).toBeTruthy();
  });
});
