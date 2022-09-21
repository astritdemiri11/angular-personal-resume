import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { UserReview, UserReviewTranslation } from '../../models/user-review/user-review.model';

export const loadUserReviews = createAction('[HOME_USER-REVIEW] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadUserReviewsSuccess = createAction('[HOME_USER-REVIEW] LOAD_SUCCESS', props<{ languageCode: LanguageCode, userReviews: UserReview[] }>());
export const loadUserReviewsFailure = createAction('[HOME_USER-REVIEW] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateUserReviews = createAction('[HOME_USER-REVIEW] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateUserReviewsSuccess = createAction('[HOME_USER-REVIEW] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<UserReviewTranslation>[] }>());
export const translateUserReviewsFailure = createAction('[HOME_USER-REVIEW] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());
