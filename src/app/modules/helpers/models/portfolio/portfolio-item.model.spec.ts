import { PortfolioItem } from './portfolio-item.model';

describe('PortfolioItem', () => {
  it('should create an instance', () => {
    expect(new PortfolioItem({ id: 0, i: '', s: '', t: '' })).toBeTruthy();
  });
});
