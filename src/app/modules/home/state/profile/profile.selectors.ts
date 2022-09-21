import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { selectHomeState, State } from '..';
import { Profile } from '../../models/profile/profile.model';
import { State as ProfileState } from './profile.reducer';

export const selectProfileState = createSelector(selectHomeState, (state: State) => {
  return state.profile
});

export const selectProfile = (languageCode: LanguageCode) => createSelector(
  selectProfileState,
  (state: ProfileState): Profile | null => {
    if (!state.profileTranslation) {
      return null;
    }

    const translation = state.profileTranslation.translations[languageCode];

    if (!translation) {
      return null;
    }

    return { ...state.profileTranslation.profile, ...translation };
  }
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectProfileState,
  (state: ProfileState) => state.status[languageCode]
);
