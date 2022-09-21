import { createSelector } from '@ngrx/store';

import { selectCoreState, State } from '..';
import { State as ThemeState } from './settings.reducer';

export const selectLayoutState = createSelector(selectCoreState, (state: State) => state.settings);

export const selectAppMode = createSelector(
  selectLayoutState,
  (state: ThemeState) => state.appMode
);

export const selectLastTheme = createSelector(
  selectLayoutState,
  (state: ThemeState) => state.lastTheme
);

export const selectTheme = createSelector(
  selectLayoutState,
  (state: ThemeState) => state.theme
);
