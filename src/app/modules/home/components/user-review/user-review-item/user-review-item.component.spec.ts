import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { QUOTE_SVG } from '../../../constants/other-svg.constant';
import { UserReview } from '../../../models/user-review/user-review.model';
import { UserReviewItemComponent } from './user-review-item.component';

describe('UserReviewItemComponent', () => {
  let component: UserReviewItemComponent;
  let fixture: ComponentFixture<UserReviewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReviewItemComponent);
    component = fixture.componentInstance;
    component.item = new UserReview({ id: 0, d: '', f: '', i: '', p: '' });
    const domSanitizer = fixture.debugElement.injector.get(DomSanitizer);
    const matIconRegistry = fixture.debugElement.injector.get(MatIconRegistry);

    matIconRegistry.addSvgIconLiteralInNamespace('other', 'quote',
      domSanitizer.bypassSecurityTrustHtml(QUOTE_SVG));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
