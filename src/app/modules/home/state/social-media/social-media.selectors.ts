import { createSelector } from '@ngrx/store';

import { selectHomeState, State } from '..';
import { SocialMediaItem } from '../../models/social-media/social-media-item.interface';
import { adapter, State as SocialMediaState } from './social-media.reducer';

export const selectSocialMediaState = createSelector(selectHomeState, (state: State) => {
  return state.socialMedia
});

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectSocialMediaState);

export const selectSocialMediaIds = selectIds;
export const selectSocialMediaEntities = selectEntities;
export const selectAllSocialMedias = selectAll;
export const selectSocialMediaTotal = selectTotal;

export const selectSocialMediaItems = createSelector(
  selectSocialMediaState,
  selectAllSocialMedias,
  (_state: SocialMediaState, socialMediaItems: SocialMediaItem[]) => socialMediaItems
);

export const selectStatus = createSelector(
  selectSocialMediaState,
  (state: SocialMediaState) => state.status
);
