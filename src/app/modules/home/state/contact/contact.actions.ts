import { createAction, props } from '@ngrx/store';

import { Contact } from '../../models/contact/contact.model';

export const loadContact = createAction('[HOME_CONTACT] LOAD', props<{ path: string }>());
export const loadContactSuccess = createAction('[HOME_CONTACT] LOAD_SUCCESS', props<{ contact: Contact }>());
export const loadContactFailure = createAction('[HOME_CONTACT] LOAD_FAILURE', props<{ error: string }>());
