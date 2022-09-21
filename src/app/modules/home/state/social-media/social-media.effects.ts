import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { SocialMediaService } from '../../services/social-media/social-media.service';
import * as SocialMediaActions from './social-media.actions';
import * as fromSocialMediaReducer from './social-media.reducer';


@Injectable()
export class SocialMediaEffects {
  loadSocialMedia$ = createEffect(() => this.actions$.pipe(
    ofType(SocialMediaActions.loadSocialMedia),
    switchMap(action => {
      return this.socialMediaService.request.loadSocialMedia(action.path);
    }),
    catchError((error: CustomError<{}>, caught) => {
      this.store.dispatch(SocialMediaActions.loadSocialMediaFailure({ error: error.message }));
      return caught;
    }),
    map(response => {
      const items = this.socialMediaService.business.convertDTOs(response.data);
      return SocialMediaActions.loadSocialMediaSuccess({ items });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromSocialMediaReducer.State>, private socialMediaService: SocialMediaService) {}
}
