import { Profile } from './profile.model';

describe('Me', () => {
  it('should create an instance', () => {
    expect(new Profile({ n: '', s: '', d: new Date().toISOString(), p: '', b: '', l: [] })).toBeTruthy();
  });
});
