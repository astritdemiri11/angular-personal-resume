import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take, timer } from 'rxjs';
import { Required } from 'src/app/shared/decorators/required/required.decorator';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { UserReview } from '../../../models/user-review/user-review.interface';
import { UserReviewService } from '../../../services/user-review/user-review.service';

@Component({
  selector: 'app-user-review-item',
  templateUrl: './user-review-item.component.html',
  styleUrls: ['./user-review-item.component.scss']
})
export class UserReviewItemComponent {
  @Input() @Required('app-user-review-item') item?: UserReview;

  @ViewChild('review', { static: false }) review?: ElementRef<HTMLDivElement>;
  @ViewChild('reviewTriangle', { static: false }) reviewTriangle?: ElementRef<HTMLDivElement>;
  @ViewChild('reviewLabel', { static: false }) reviewLabel?: ElementRef<HTMLSpanElement>;

  isLoading: boolean;
  isLoaded: boolean;

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    public userReviewService: UserReviewService,
    private languageService: LanguageService,
    private renderer2: Renderer2) {
    this.subscriptions = [];

    this.isLoading = false;
    this.isLoaded = false;
   }

  onMouseOver() {
    if(this.review) {
      const reviewElem = this.review.nativeElement;
      this.renderer2.addClass(reviewElem, 'theme-accent_border');
    }

    if(this.reviewTriangle) {
      const reviewTriangleElem = this.reviewTriangle.nativeElement;
      this.renderer2.addClass(reviewTriangleElem, 'theme-accent_border');
    }

    if(this.reviewLabel) {
      const reviewLabelElem = this.reviewLabel.nativeElement;
      this.renderer2.addClass(reviewLabelElem, 'theme-accent_color');
    }
  }

  onMouseLeave() {
    if(this.review) {
      const reviewElem = this.review.nativeElement;
      this.renderer2.removeClass(reviewElem, 'theme-accent_border');
    }

    if(this.reviewTriangle) {
      const reviewTriangleElem = this.reviewTriangle.nativeElement;
      this.renderer2.removeClass(reviewTriangleElem, 'theme-accent_border');
    }

    if(this.reviewLabel) {
      const reviewLabelElem = this.reviewLabel.nativeElement;
      this.renderer2.removeClass(reviewLabelElem, 'theme-accent_color');
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      const firstLoad = languageCode === lastActiveLanguageCode;

      if (!firstLoad) {
        this.isLoading = true;
        this.isLoaded = false;

        this.userReviewService.model.status().pipe(
          filter(status => status === ResponseType.Success), take(1)
        ).subscribe(() => {
          timer(0).subscribe(() => {
            this.isLoading = false;
            this.isLoaded = true;
          });
        });
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
