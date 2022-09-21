import { Skill } from './skill.model';

describe('Skill', () => {
  it('should create an instance', () => {
    expect(new Skill({ id: 0, p: 0, t: '' })).toBeTruthy();
  });
});
