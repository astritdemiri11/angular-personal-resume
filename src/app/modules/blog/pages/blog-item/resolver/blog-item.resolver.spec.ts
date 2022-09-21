import { TestBed } from '@angular/core/testing';

import { BlogItemResolver } from './blog-item.resolver';

describe('BlogItemResolver', () => {
  let resolver: BlogItemResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BlogItemResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
