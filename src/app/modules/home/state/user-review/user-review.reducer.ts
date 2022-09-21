import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { UserReviewTranslation as UserReviewTranslationInterface } from '../../models/user-review/user-review.interface';
import { UserReviewTranslation } from '../../models/user-review/user-review.model';
import * as UserReviewActions from './user-review.actions';

export interface State extends EntityState<UserReviewTranslationInterface> {
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(userReviewTranslation: UserReviewTranslationInterface): number {
  return userReviewTranslation.userReview.id;
}

export function sortByName(aUserReviewTranslation: UserReviewTranslationInterface, bUserReviewTranslation: UserReviewTranslationInterface): number {
  return aUserReviewTranslation.userReview.id - bUserReviewTranslation.userReview.id
  // return aUserReview.name.localeCompare(bUserReview.name);
}

export const adapter: EntityAdapter<UserReviewTranslationInterface> = createEntityAdapter<UserReviewTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const userReviewReducer = createReducer(
  initialState,

  on(UserReviewActions.loadUserReviews, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(UserReviewActions.loadUserReviewsSuccess, (state: State, { languageCode, userReviews }) => {
    const copyState = adapter.setAll(userReviews.map(userReview => new UserReviewTranslation(languageCode, userReview)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(UserReviewActions.loadUserReviewsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(UserReviewActions.translateUserReviews, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(UserReviewActions.translateUserReviewsSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateNum<UserReviewTranslation>[] = [];

    for (const languageTranslation of translations) {
      const entity = { ...state.entities[languageTranslation.id] };
      const update = { ...languageTranslation };

      update.changes = { ...languageTranslation.changes };
      update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

      updates.push(update);
    }

    const copyState = adapter.updateMany(updates, state);

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(UserReviewActions.translateUserReviewsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return userReviewReducer(state, action);
}

export const featureKey = 'userReview';
