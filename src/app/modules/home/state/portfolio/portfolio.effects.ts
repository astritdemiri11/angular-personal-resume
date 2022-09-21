import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { PortfolioItemTranslation } from '../../../helpers/models/portfolio/portfolio-item.model';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import * as PortfolioActions from './portfolio.actions';
import * as fromPortfolioReducer from './portfolio.reducer';

@Injectable()
export class PortfolioEffects {
  loadPortfolio$ = createEffect(() => this.actions$.pipe(
    ofType(PortfolioActions.loadPortfolio),
    switchMap(action => {
      return this.portfolioService.request.loadPortfolio(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(PortfolioActions.loadPortfolioFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const items = this.portfolioService.business.convertDTOs(response.data);
      return PortfolioActions.loadPortfolioSuccess({ languageCode: response.append.languageCode, items });
    })
  ));

  translatePortfolio$ = createEffect(() => this.actions$.pipe(
    ofType(PortfolioActions.translatePortfolio),
    switchMap(action => {
      return this.portfolioService.request.translatePortfolio(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(PortfolioActions.translatePortfolioFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const portfolio = this.portfolioService.business.convertDTOs(response.data);
      const translations: UpdateNum<PortfolioItemTranslation>[] = portfolio.map(portfolioItem => ({
        id: portfolioItem.id, changes: {
          translations: {
            [response.append.languageCode]: {
              subtitle: portfolioItem.subtitle,
              title: portfolioItem.title
            }
          }
        }
      }));

      return PortfolioActions.translatePortfolioSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromPortfolioReducer.State>, private portfolioService: PortfolioService) {}
}
