import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { ProductTranslation as ProductTranslationInterface } from '../../models/product/product.interface';
import { ProductTranslation } from '../../models/product/product.model';
import * as ProductActions from './product.actions';

export interface State extends EntityState<ProductTranslationInterface> {
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(productTranslation: ProductTranslationInterface): number {
  return productTranslation.product.id;
}

export function sortByName(aProductTranslation: ProductTranslationInterface, bProductTranslation: ProductTranslationInterface): number {
  return aProductTranslation.product.id - bProductTranslation.product.id
  // return aProduct.name.localeCompare(bProduct.name);
}

export const adapter: EntityAdapter<ProductTranslationInterface> = createEntityAdapter<ProductTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const productReducer = createReducer(
  initialState,

  on(ProductActions.loadProducts, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ProductActions.loadProductsSuccess, (state: State, { languageCode, products }) => {
    const copyState = adapter.setAll(products.map(product => new ProductTranslation(languageCode, product)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(ProductActions.loadProductsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(ProductActions.translateProducts, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ProductActions.translateProductsSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateNum<ProductTranslation>[] = [];

    for (const languageTranslation of translations) {
      const entity = { ...state.entities[languageTranslation.id] };
      const update = { ...languageTranslation };

      update.changes = { ...languageTranslation.changes };
      update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

      updates.push(update);
    }

    const copyState = adapter.updateMany(updates, state);

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(ProductActions.translateProductsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return productReducer(state, action);
}

export const featureKey = 'product';
