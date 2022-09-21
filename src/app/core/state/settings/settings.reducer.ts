import { Action, createReducer, on } from '@ngrx/store';

import { ThemeType } from '../../models/theme/theme.enum';
import * as ThemeActions from './settings.actions';

export interface State {
  appMode: boolean,
  lastTheme: ThemeType
  theme: ThemeType
}

const initialState: State = {
  appMode: false,
  lastTheme: ThemeType.DarkGreyCyan,
  theme: ThemeType.DarkGreyCyan,
};

const layoutReducer = createReducer(initialState,
  on(ThemeActions.setLinkAppMode, (state: State, { appMode }) => {
    return { ...state, appMode };
  }),
  on(ThemeActions.presetTheme, (state: State, { theme }) => {
    return { ...state, theme, lastTheme: theme };
  }),
  on(ThemeActions.setTheme, (state: State, { theme }) => {
    return { ...state, theme, lastTheme: state.theme };
  }));

export function reducer(state: State | undefined, action: Action) {
  return layoutReducer(state, action);
}

export const featureKey = 'settings';
