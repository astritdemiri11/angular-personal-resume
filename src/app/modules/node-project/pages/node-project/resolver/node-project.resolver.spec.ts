import { TestBed } from '@angular/core/testing';

import { NodeProjectResolver } from './node-project.resolver';

describe('NodeProjectResolver', () => {
  let resolver: NodeProjectResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NodeProjectResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
