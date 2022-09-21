import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { Profile } from '../../models/profile/profile.model';

export const loadProfile = createAction('[HOME_PROFILE] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadProfileSuccess = createAction('[HOME_PROFILE] LOAD_SUCCESS', props<{ languageCode: LanguageCode, profile: Profile }>());
export const loadProfileFailure = createAction('[HOME_PROFILE] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateProfile = createAction('[HOME_PROFILE] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateProfileSuccess = createAction('[HOME_PROFILE] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, profile: Profile }>());
export const translateProfileFailure = createAction('[HOME_PROFILE] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());
