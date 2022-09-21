import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { ProfileTranslation } from '../../models/profile/profile.model';
import * as ProfileActions from './profile.actions';

export interface State {
  profileTranslation: ProfileTranslation | null;
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

const initialState: State = {
  profileTranslation: null,
  status: {},
  error: null
};

const profileReducer = createReducer(
  initialState,

  on(ProfileActions.loadProfile, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ProfileActions.loadProfileSuccess, (state: State, { languageCode, profile }) => {
    const copyState = { ...state, profileTranslation: new ProfileTranslation(languageCode, profile), error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(ProfileActions.loadProfileFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(ProfileActions.translateProfile, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ProfileActions.translateProfileSuccess, (state: State, { languageCode, profile }) => {
    const copyState = { ...state, error: null };

    if (copyState.profileTranslation) {
      copyState.profileTranslation = { ...copyState.profileTranslation };
      copyState.profileTranslation.translations = { ...copyState.profileTranslation.translations }
      copyState.profileTranslation.translations[languageCode] = { bio: profile.bio, profession: profile.profession };
    }

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState
  }),
  on(ProfileActions.translateProfileFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return profileReducer(state, action);
}

export const featureKey = 'profile';
