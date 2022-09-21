import { TestBed } from '@angular/core/testing';

import { NgLibraryResolver } from './ng-library.resolver';

describe('NgLibraryResolver', () => {
  let resolver: NgLibraryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NgLibraryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
