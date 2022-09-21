import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
