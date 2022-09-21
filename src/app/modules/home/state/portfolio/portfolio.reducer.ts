import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import {
  PortfolioItemTranslation as PortfolioItemTranslationInterface,
} from '../../../helpers/models/portfolio/portfolio-item.interface';
import { PortfolioItemTranslation } from '../../../helpers/models/portfolio/portfolio-item.model';
import * as PortfolioActions from './portfolio.actions';

export interface State extends EntityState<PortfolioItemTranslationInterface> {
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(portfolioItemTranslation: PortfolioItemTranslationInterface): number {
  return portfolioItemTranslation.item.id;
}

export function sortByName(aPortfolioItemTranslation: PortfolioItemTranslationInterface, bPortfolioItemTranslation: PortfolioItemTranslationInterface): number {
  return aPortfolioItemTranslation.item.id - bPortfolioItemTranslation.item.id
  // return aPortfolio.name.localeCompare(bPortfolio.name);
}

export const adapter: EntityAdapter<PortfolioItemTranslationInterface> = createEntityAdapter<PortfolioItemTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const portfolioReducer = createReducer(
  initialState,

  on(PortfolioActions.loadPortfolio, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(PortfolioActions.loadPortfolioSuccess, (state: State, { languageCode, items }) => {
    const copyState = adapter.setAll(items.map(item => new PortfolioItemTranslation(languageCode, item)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(PortfolioActions.loadPortfolioFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(PortfolioActions.translatePortfolio, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(PortfolioActions.translatePortfolioSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateNum<PortfolioItemTranslation>[] = [];

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
  on(PortfolioActions.translatePortfolioFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return portfolioReducer(state, action);
}

export const featureKey = 'portfolio';
