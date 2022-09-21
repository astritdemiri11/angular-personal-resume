import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';
import { ContactService } from '../../services/contact/contact.service';

import * as ContactActions from './contact.actions';
import * as fromContactReducer from './contact.reducer';


@Injectable()
export class ContactEffects {
  loadContact$ = createEffect(() => this.actions$.pipe(
    ofType(ContactActions.loadContact),
    switchMap(action => {
      return this.contactService.request.loadContact(action.path);
    }),
    catchError((error: CustomError<{}>, caught) => {
      this.store.dispatch(ContactActions.loadContactFailure({ error: error.message }));
      return caught;
    }),
    map(response => {
      const contact = this.contactService.business.convertDTO(response.data);
      return ContactActions.loadContactSuccess({ contact });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromContactReducer.State>, private contactService: ContactService) {}
}
