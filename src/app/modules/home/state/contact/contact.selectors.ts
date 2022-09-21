import { createSelector } from '@ngrx/store';

import { selectHomeState, State } from '..';
import { State as ContactState } from './contact.reducer';

export const selectContactState = createSelector(selectHomeState, (state: State) => {
  return state.contact
});

export const selectContact = createSelector(
  selectContactState,
  (state: ContactState) => state.contact
);

export const selectStatus = createSelector(
  selectContactState,
  (state: ContactState) => state.status
);
