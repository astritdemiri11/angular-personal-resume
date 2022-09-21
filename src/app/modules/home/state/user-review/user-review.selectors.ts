import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { selectHomeState, State } from '..';
import { UserReview, UserReviewTranslation } from '../../models/user-review/user-review.interface';
import { adapter, State as UserReviewState } from './user-review.reducer';

export const selectUserReviewState = createSelector(selectHomeState, (state: State) => {
  return state.userReview
});

const {
  selectAll
} = adapter.getSelectors(selectUserReviewState);

export const selectUserReviews = (languageCode: LanguageCode) => createSelector(
  selectUserReviewState,
  selectAll,
  (_state: UserReviewState, productTranslations: UserReviewTranslation[]): (UserReview | null)[] => productTranslations.map(productTranslation => {
    const translation = productTranslation.translations[languageCode];

    if(!translation) {
      return null;
    }

    return { ...productTranslation.userReview, ...translation }
  })
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectUserReviewState,
  (state: UserReviewState) => state.status[languageCode]
);
