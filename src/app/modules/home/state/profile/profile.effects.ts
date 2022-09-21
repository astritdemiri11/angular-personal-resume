import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { ProfileService } from '../../services/profile/profile.service';
import * as ProfileActions from './profile.actions';
import * as fromProfileReducer from './profile.reducer';


@Injectable()
export class ProfileEffects {
  loadProfile$ = createEffect(() => this.actions$.pipe(
    ofType(ProfileActions.loadProfile),
    switchMap(action => {
      return this.profileService.request.loadProfile(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ProfileActions.loadProfileFailure({  languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const profile = this.profileService.business.convertDTO(response.data);
      return ProfileActions.loadProfileSuccess({ languageCode: response.append.languageCode, profile });
    })
  ));

  translateProfile$ = createEffect(() => this.actions$.pipe(
    ofType(ProfileActions.translateProfile),
    switchMap(action => {
      return this.profileService.request.translateProfile(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ProfileActions.translateProfileFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const profile = this.profileService.business.convertDTO(response.data);
      return ProfileActions.translateProfileSuccess({ languageCode: response.append.languageCode, profile });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromProfileReducer.State>, private profileService: ProfileService) {}
}
