import { Product } from './product.model';

describe('Product', () => {
  it('should create an instance', () => {
    expect(new Product({ id: 0, d: '', t: '', i: '' })).toBeTruthy();
  });
});
