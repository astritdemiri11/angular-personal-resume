import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { UserReview as UserReviewInterface, UserReviewDTO } from '../../models/user-review/user-review.interface';
import { UserReview } from '../../models/user-review/user-review.model';
import * as UserReviewActions from '../../state/user-review/user-review.actions';
import * as fromUserReviewReducer from '../../state/user-review/user-review.reducer';
import * as UserReviewSelectors from '../../state/user-review/user-review.selectors';

@Injectable({
  providedIn: 'root',
})
export class UserReviewService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromUserReviewReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

    private getModel() {
      return {
        state$: this.store.select(UserReviewSelectors.selectUserReviewState),
        userReviews: () => {
          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(UserReviewSelectors.selectUserReviews(languageCode))
        },
        lastUserReviews: () => {
          const languageCode = this.languageService.business.getLastActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(UserReviewSelectors.selectUserReviews(languageCode))
        },
        status: () => {
          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(UserReviewSelectors.selectStatus(languageCode))
        }
      }
    }

    private getBusiness() {
      const self = this;

      return {
        convertDTOs: (userReviewDTOs: UserReviewDTO[]) => {
          return userReviewDTOs.map(userReviewDTO => new UserReview(userReviewDTO));
        },
        loadUserReviews: (path: string, force: boolean = false) => {
          self.model.status().pipe(take(1)).subscribe(status => {
            if(status === ResponseType.Loading) {
              return;
            }

            if (!force && status === ResponseType.Success) {
              return;
            }

            const languageCode = this.languageService.business.getActiveLanguageCode();

            if (!languageCode) {
              throw new Error('Cannot load userReviews without setting a default language!')
            }

            self.store.dispatch(UserReviewActions.loadUserReviews({ path: `${path}/${languageCode}.json`, languageCode }));
          });
        },
        getUserReviews: (): UserReviewInterface[] => {
          let userReviews: UserReviewInterface[] = [];

          this.model.userReviews().pipe(take(1)).subscribe(stateUserReviews => {
            if(!stateUserReviews.filter(userReview => userReview === null).length) {
              stateUserReviews.forEach(userReview => {
                if(userReview) {
                  userReviews.push(userReview)
                }
              });
            }
          });

          if (!userReviews.length) {
            this.model.lastUserReviews().pipe(take(1)).subscribe(stateUserReviews => {
              stateUserReviews.forEach(userReview => {
                if(userReview) {
                  userReviews.push(userReview)
                }
              });
            });
          }

          return userReviews;
        },
        translateUserReviews: (path: string, force: boolean = false) => {
          self.model.status().pipe(take(1)).subscribe(status => {
            if(status === ResponseType.Loading) {
              return;
            }

            if (!force && status === ResponseType.Success) {
              return;
            }

            const languageCode = this.languageService.business.getActiveLanguageCode();

            if (!languageCode) {
              throw new Error('Cannot translate userReviews without setting a default language!')
            }

            self.store.dispatch(UserReviewActions.translateUserReviews({ path: `${path}/${languageCode}.json`, languageCode }));
          });
        }
      }
    }

    private getRequest() {
      const self = this;

      return {
        loadUserReviews: (path: string, languageCode: LanguageCode) => {
          return self.translationLoaderService.get<UserReviewDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
        },
        translateUserReviews: (path: string, languageCode: LanguageCode) => {
          return self.translationLoaderService.get<UserReviewDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
        }
      }
    }
}
