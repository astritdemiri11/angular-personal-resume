import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { selectHomeState, State } from '..';
import { PortfolioItem, PortfolioItemTranslation } from '../../../helpers/models/portfolio/portfolio-item.interface';
import { adapter, State as PortfolioState } from './portfolio.reducer';

export const selectPortfolioState = createSelector(selectHomeState, (state: State) => {
  return state.portfolio
});

const {
  selectAll,
} = adapter.getSelectors(selectPortfolioState);

export const selectPortfolioItems = (languageCode: LanguageCode) => createSelector(
  selectPortfolioState,
  selectAll,
  (_state: PortfolioState, portfolioItemTranslations: PortfolioItemTranslation[]): (PortfolioItem | null)[] => portfolioItemTranslations.map(portfolioItemTranslation => {
    const translation = portfolioItemTranslation.translations[languageCode];

    if(!translation) {
      return null;
    }

    return { ...portfolioItemTranslation.item, ...translation }
  })
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectPortfolioState,
  (state: PortfolioState) => state.status[languageCode]
);
