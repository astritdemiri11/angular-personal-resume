import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import {
  PortfolioItem as PortfolioItemInterface,
  PortfolioItemDTO,
} from '../../../helpers/models/portfolio/portfolio-item.interface';
import { PortfolioItem } from '../../../helpers/models/portfolio/portfolio-item.model';
import * as PortfolioActions from '../../state/portfolio/portfolio.actions';
import * as fromPortfolioReducer from '../../state/portfolio/portfolio.reducer';
import * as PortfolioSelectors from '../../state/portfolio/portfolio.selectors';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromPortfolioReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(PortfolioSelectors.selectPortfolioState),
      portfolioItems: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(PortfolioSelectors.selectPortfolioItems(languageCode))
      },
      lastPortfolioItems: () => {
        const languageCode = this.languageService.business.getLastActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(PortfolioSelectors.selectPortfolioItems(languageCode))
      },
      status: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(PortfolioSelectors.selectStatus(languageCode))
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTOs: (portfolioItemDTOs: PortfolioItemDTO[]) => {
        return portfolioItemDTOs.map(portfolioItemDTO => new PortfolioItem(portfolioItemDTO));
      },
      loadPortfolio: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load portfolio without setting a default language!')
          }

          self.store.dispatch(PortfolioActions.loadPortfolio({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      getPortfolioItems: (): PortfolioItemInterface[] => {
        let portfolioItems: PortfolioItemInterface[] = [];

        this.model.portfolioItems().pipe(take(1)).subscribe(statePortfolioItem => {
          if (!statePortfolioItem.filter(portfolioItem => portfolioItem === null).length) {
            statePortfolioItem.forEach(portfolioItem => {
              if (portfolioItem) {
                portfolioItems.push(portfolioItem)
              }
            });
          }
        });

        if (!portfolioItems.length) {
          this.model.lastPortfolioItems().pipe(take(1)).subscribe(statePortfolioItems => {
            statePortfolioItems.forEach(portfolioItem => {
              if (portfolioItem) {
                portfolioItems.push(portfolioItem)
              }
            });
          });
        }

        return portfolioItems;
      },
      translatePortfolio: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot translate portfolio without setting a default language!')
          }

          self.store.dispatch(PortfolioActions.translatePortfolio({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadPortfolio: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<PortfolioItemDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      },
      translatePortfolio: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<PortfolioItemDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      }
    }
  }
}
