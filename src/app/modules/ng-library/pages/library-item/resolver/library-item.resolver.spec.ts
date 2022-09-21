import { TestBed } from '@angular/core/testing';

import { LibraryItemResolver } from './library-item.resolver';

describe('LibraryItemResolver', () => {
  let resolver: LibraryItemResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LibraryItemResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
