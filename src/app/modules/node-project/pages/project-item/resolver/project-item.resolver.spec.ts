import { TestBed } from '@angular/core/testing';

import { ProjectItemResolver } from './project-item.resolver';

describe('ProjectItemResolver', () => {
  let resolver: ProjectItemResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProjectItemResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
