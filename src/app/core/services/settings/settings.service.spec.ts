import { TestBed } from '@angular/core/testing';
import { TESTING_PROVIDERS } from 'src/app/spec/constants';

import { SettingsService } from './settings.service';

describe('ThemeService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TESTING_PROVIDERS]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
