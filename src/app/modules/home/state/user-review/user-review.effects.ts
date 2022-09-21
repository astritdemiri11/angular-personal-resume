import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { UserReviewTranslation } from '../../models/user-review/user-review.model';
import { UserReviewService } from '../../services/user-review/user-review.service';
import * as UserReviewActions from './user-review.actions';
import * as fromUserReviewReducer from './user-review.reducer';


@Injectable()
export class UserReviewEffects {
  loadUserReviews$ = createEffect(() => this.actions$.pipe(
    ofType(UserReviewActions.loadUserReviews),
    switchMap(action => {
      return this.userReviewService.request.loadUserReviews(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(UserReviewActions.loadUserReviewsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const userReviews = this.userReviewService.business.convertDTOs(response.data);
      return UserReviewActions.loadUserReviewsSuccess({ languageCode: response.append.languageCode, userReviews });
    })
  ));

  translateUserReviews$ = createEffect(() => this.actions$.pipe(
    ofType(UserReviewActions.translateUserReviews),
    switchMap(action => {
      return this.userReviewService.request.translateUserReviews(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(UserReviewActions.translateUserReviewsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const userReviews = this.userReviewService.business.convertDTOs(response.data);
      const translations: UpdateNum<UserReviewTranslation>[] = userReviews.map(userReview => ({
        id: userReview.id, changes: {
          translations: {
            [response.append.languageCode]: {
              description: userReview.description,
              profession: userReview.profession
            }
          }
        }
      }));

      return UserReviewActions.translateUserReviewsSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromUserReviewReducer.State>, private userReviewService: UserReviewService) {}
}
