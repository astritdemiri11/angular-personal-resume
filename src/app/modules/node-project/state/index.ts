import { Action, ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromNodeProjectReducer from './project/project.reducer';

export interface State {
  [fromNodeProjectReducer.featureKey]: fromNodeProjectReducer.State
}

export const reducers: ActionReducerMap<State, Action> = {
  [fromNodeProjectReducer.featureKey]: fromNodeProjectReducer.reducer
};

export const featureKey = 'nodeProject';

export const selectNodeProjectState = createFeatureSelector<State>(featureKey);
