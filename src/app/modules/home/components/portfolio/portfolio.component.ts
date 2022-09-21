import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { PortfolioItem } from '../../../helpers/models/portfolio/portfolio-item.interface';
import { REQUEST_URL } from '../../constants/url.constant';
import { PortfolioService } from '../../services/portfolio/portfolio.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolioItems: PortfolioItem[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    private languageService: LanguageService,
    private portfolioService: PortfolioService) {
    this.subscriptions = [];
    this.portfolioItems = [];
  }

  ngOnInit() {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.portfolioService.business.loadPortfolio(`${serverUrl}/${feature.portfolio.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.portfolioService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.portfolioItems = this.portfolioService.business.getPortfolioItems();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.portfolioService.business.translatePortfolio(`${serverUrl}/${feature.portfolio.translate}`);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
