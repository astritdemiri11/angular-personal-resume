import { TestBed } from '@angular/core/testing';

import { DescriptionResolver } from './description.resolver';

describe('DescriptionResolver', () => {
  let resolver: DescriptionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DescriptionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
