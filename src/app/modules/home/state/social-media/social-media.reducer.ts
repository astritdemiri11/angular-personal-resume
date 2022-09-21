import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { SocialMediaItem } from '../../models/social-media/social-media-item.interface';
import * as SocialMediaActions from './social-media.actions';

export interface State extends EntityState<SocialMediaItem> {
  status: ResponseType;
  error: string | null;
}

export function selectId(socialMedia: SocialMediaItem): number {
  return socialMedia.id;
}

export function sortByName(aSocialMedia: SocialMediaItem, bSocialMedia: SocialMediaItem): number {
  return aSocialMedia.id - bSocialMedia.id
  // return aSocialMedia.name.localeCompare(bSocialMedia.name);
}

export const adapter: EntityAdapter<SocialMediaItem> = createEntityAdapter<SocialMediaItem>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: ResponseType.Undefined,
  error: null
});

const socialMediaReducer = createReducer(
  initialState,

  on(SocialMediaActions.loadSocialMedia, (state: State) => {
    return { ...state, status: ResponseType.Loading, error: null }
  }),
  on(SocialMediaActions.loadSocialMediaSuccess, (state: State, { items }) => {
    return adapter.setAll(items, { ...state, status: ResponseType.Success, error: null });
  }),
  on(SocialMediaActions.loadSocialMediaFailure, (state: State, { error }) => {
    return { ...state, status: ResponseType.Failure, error };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return socialMediaReducer(state, action);
}

export const featureKey = 'socialMedia';
