import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Contact } from '../../models/contact/contact.model';
import * as ContactActions from './contact.actions';

export interface State {
  contact: Contact | null;
  status: ResponseType;
  error: string | null;
}

const initialState: State = {
  contact: null,
  status: ResponseType.Undefined,
  error: null
};

const contactReducer = createReducer(
  initialState,

  on(ContactActions.loadContact, (state: State) => {
    return { ...state, status: ResponseType.Loading, error: null }
  }),
  on(ContactActions.loadContactSuccess, (state: State, { contact }) => {
    return { ...state, contact, status: ResponseType.Success, error: null };
  }),
  on(ContactActions.loadContactFailure, (state: State, { error }) => {
    return { ...state, status: ResponseType.Failure, error };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return contactReducer(state, action);
}

export const featureKey = 'contact';
