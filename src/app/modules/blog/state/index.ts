import { Action, ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromBlogParentReducer from './blog/blog.reducer';

export interface State {
  [fromBlogParentReducer.featureKey]: fromBlogParentReducer.State
}

export const reducers: ActionReducerMap<State, Action> = {
  [fromBlogParentReducer.featureKey]: fromBlogParentReducer.reducer
};

export const featureKey = 'blogParent';

export const selectBlogParentState = createFeatureSelector<State>(featureKey);
