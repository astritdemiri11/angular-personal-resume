import { createAction, props } from '@ngrx/store';

import { SocialMediaItem } from '../../models/social-media/social-media-item.model';

export const loadSocialMedia = createAction('[HOME_SOCIAL-MEDIA] LOAD', props<{ path: string }>());
export const loadSocialMediaSuccess = createAction('[HOME_SOCIAL-MEDIA] LOAD_SUCCESS', props<{ items: SocialMediaItem[] }>());
export const loadSocialMediaFailure = createAction('[HOME_SOCIAL-MEDIA] LOAD_FAILURE', props<{ error: string }>());
