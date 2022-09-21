import { SocialMediaItem } from './social-media-item.model';

describe('SocialMediaItem', () => {
  it('should create an instance', () => {
    expect(new SocialMediaItem({ id: 0, i: '', t: '', l: { a: '', u: '' } })).toBeTruthy();
  });
});
