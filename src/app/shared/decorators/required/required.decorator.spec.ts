import { Required } from './required.decorator';

describe('Required', () => {
  it('should create an instance', () => {
    expect(Required('selector')).toBeTruthy();
  });
});
