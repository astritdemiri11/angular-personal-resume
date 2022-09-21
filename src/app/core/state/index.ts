import { Action, ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromSettingsReducer from './settings/settings.reducer';

export interface State {
  [fromSettingsReducer.featureKey]: fromSettingsReducer.State
}

export const reducers: ActionReducerMap<State, Action> = {
  [fromSettingsReducer.featureKey]: fromSettingsReducer.reducer
};

export const featureKey = 'core';

export const selectCoreState = createFeatureSelector<State>(featureKey);
