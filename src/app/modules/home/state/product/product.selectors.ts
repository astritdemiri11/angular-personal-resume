import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { selectHomeState, State } from '..';
import { Product, ProductTranslation } from '../../models/product/product.interface';
import { adapter, State as ProductState } from './product.reducer';

export const selectProductState = createSelector(selectHomeState, (state: State) => {
  return state.product
});

const {
  selectAll,
} = adapter.getSelectors(selectProductState);

export const selectProducts = (languageCode: LanguageCode) => createSelector(
  selectProductState,
  selectAll,
  (_state: ProductState, productTranslations: ProductTranslation[]): (Product | null)[] => productTranslations.map(productTranslation => {
    const translation = productTranslation.translations[languageCode];

    if(!translation) {
      return null;
    }

    return { ...productTranslation.product, ...translation }
  })
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectProductState,
  (state: ProductState) => state.status[languageCode]
);
