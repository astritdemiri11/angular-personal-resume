import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { CarouselConfig } from 'ngx-scroll-carousel';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { REQUEST_URL } from '../../constants/url.constant';
import { UserReview } from '../../models/user-review/user-review.interface';
import { UserReviewService } from '../../services/user-review/user-review.service';

@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.scss']
})
export class UserReviewComponent implements OnInit {
  carouselConfigs: CarouselConfig;
  userReviews: UserReview[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    private languageService: LanguageService,
    private userReviewService: UserReviewService) {
    this.carouselConfigs = { items: 0 }

    this.userReviews = [];
    this.subscriptions = [];
  }

  ngOnInit() {
    this.carouselConfigs = {
      items: 0,
      itemsGapPX: 16,
      controlsActiveClass: 'theme-accent_background',
      controlsButtonClass: 'theme-primary_background_300',
      controlsOverClass: 'theme-accent_background_200',
      navigation: false,
      speed: 6000,
      omitChanges: true
    };

    this.subscriptions.push(this.layoutService.model.handset$.subscribe(handset => {
      this.carouselConfigs = { ...this.carouselConfigs, items: handset ? 1 : 2, navigation: handset };
    }));

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.userReviewService.business.loadUserReviews(`${serverUrl}/${feature.userReview.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.userReviewService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.userReviews = this.userReviewService.business.getUserReviews();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.userReviewService.business.translateUserReviews(`${serverUrl}/${feature.userReview.translate}`);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
