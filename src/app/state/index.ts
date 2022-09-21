import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../environments/environment';

export interface State {

}

export const reducers: ActionReducerMap<State, Action> = {
};

const debug = (reducer: ActionReducer<any>): ActionReducer<any> => {
  return (state, action) => {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [debug] : [];

