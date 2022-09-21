import { Blog } from './blog.model';

describe('Blog', () => {
  it('should create an instance', () => {
    expect(new Blog({ id: 0, d: new Date().toISOString(), i: '', b: '', c: '', l: '' })).toBeTruthy();
  });
});
