import { Action, ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromNgLibraryReducer from './library/library.reducer';

export interface State {
  [fromNgLibraryReducer.featureKey]: fromNgLibraryReducer.State
}

export const reducers: ActionReducerMap<State, Action> = {
  [fromNgLibraryReducer.featureKey]: fromNgLibraryReducer.reducer
};

export const featureKey = 'ngLibrary';

export const selectNgLibraryState = createFeatureSelector<State>(featureKey);
