import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';

import { PortfolioType as LibraryType } from '../../../helpers/models/portfolio/portfolio-item.enum';
import {
  PortfolioItemTranslation as LibraryTranslationInterface,
} from '../../../helpers/models/portfolio/portfolio-item.interface';
import { PortfolioItemTranslation as LibraryTranslation } from '../../../helpers/models/portfolio/portfolio-item.model';
import { ResponseType } from '../../models/response/response.enum';
import * as LibraryActions from './library.actions';

export interface State extends EntityState<LibraryTranslationInterface> {
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(ngLibraryTranslation: LibraryTranslationInterface): number {
  return ngLibraryTranslation.item.id;
}

export function sortByName(aLibraryTranslation: LibraryTranslationInterface, bLibraryTranslation: LibraryTranslationInterface): number {
  return aLibraryTranslation.item.id - bLibraryTranslation.item.id
  // return aLibraryTranslation.item.name.localeCompare(bLibraryTranslation.item.name);
}

export const adapter: EntityAdapter<LibraryTranslationInterface> = createEntityAdapter<LibraryTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const ngLibraryReducer = createReducer(
  initialState,

  on(LibraryActions.loadLibraries, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(LibraryActions.loadLibrariesSuccess, (state: State, { languageCode, items }) => {
    items = items.filter(item => item.type === LibraryType.AngularLibrary);

    const copyState = adapter.setAll(items.map(item => new LibraryTranslation(languageCode, item)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(LibraryActions.loadLibrariesFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(LibraryActions.translateLibraries, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(LibraryActions.translateLibrariesSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateNum<LibraryTranslation>[] = [];

    for (const languageTranslation of translations) {
      const stateEntity = state.entities[languageTranslation.id];

      if (stateEntity) {
        const entity = { ...stateEntity };
        const update = { ...languageTranslation };

        update.changes = { ...languageTranslation.changes };
        update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

        updates.push(update);
      }
    }

    const copyState = adapter.updateMany(updates, state);

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(LibraryActions.translateLibrariesFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(LibraryActions.loadLibraryContent, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.ContentLoading;

    return copyState;
  }),
  on(LibraryActions.loadLibraryContentSuccess, (state: State, { name, languageCode, content }) => {
    const stateEntity = Object.values(state.entities).find(entity => {
      if (entity) {
        return entity.item.name === name;
      }

      return false;
    });

    if (stateEntity) {
      const entity = { ...stateEntity };
      const update: UpdateNum<LibraryTranslationInterface> = {
        id: stateEntity.item.id, changes: {
          content: { ...entity.content, ...{ [languageCode]: content } },
          translations: { ...entity.translations }
        }
      };

      const copyState = adapter.updateOne(update, state);

      copyState.status = { ...copyState.status };
      copyState.status[languageCode] = ResponseType.ContentSuccess;

      return copyState;
    }

    return state;
  }),
  on(LibraryActions.loadLibraryContentFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.ContentFailure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return ngLibraryReducer(state, action);
}

export const featureKey = 'library';
