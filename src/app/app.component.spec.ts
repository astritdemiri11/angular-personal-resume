import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LOGO_SVG } from './core/constants/logo.constant';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from './spec/constants';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const matIconRegistry = fixture.debugElement.injector.get(MatIconRegistry);
    const domSanitizer = fixture.debugElement.injector.get(DomSanitizer);
    matIconRegistry.addSvgIconLiteral('logo',
        domSanitizer.bypassSecurityTrustHtml(LOGO_SVG));
    expect(app).toBeTruthy();
  });
});
