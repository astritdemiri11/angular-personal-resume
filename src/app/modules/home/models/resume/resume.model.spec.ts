import { ResumeWrapper } from './resume.model';

describe('ResumeWrapper', () => {
  it('should create an instance', () => {
    expect(new ResumeWrapper({ e: [], x: [] })).toBeTruthy();
  });
});
