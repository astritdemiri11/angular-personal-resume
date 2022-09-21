import { Contact } from './contact.model';

describe('Contact', () => {
  it('should create an instance', () => {
    expect(new Contact({ a: [], e: [], p: [] })).toBeTruthy();
  });
});
