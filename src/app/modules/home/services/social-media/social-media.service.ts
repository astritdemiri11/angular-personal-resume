import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import {
  SocialMediaItem as SocialMediaItemInterface,
  SocialMediaItemDTO,
} from '../../models/social-media/social-media-item.interface';
import { SocialMediaItem } from '../../models/social-media/social-media-item.model';
import * as SocialMediaActions from '../../state/social-media/social-media.actions';
import * as fromSocialMediaReducer from '../../state/social-media/social-media.reducer';
import * as SocialMediaSelectors from '../../state/social-media/social-media.selectors';

@Injectable({
  providedIn: 'root',
})
export class SocialMediaService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromSocialMediaReducer.State>,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(SocialMediaSelectors.selectSocialMediaState),
      socialMediaItems$: this.store.select(SocialMediaSelectors.selectSocialMediaItems),
      status$: this.store.select(SocialMediaSelectors.selectStatus)
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTOs: (socialMediaItemDTOs: SocialMediaItemDTO[]) => {
        return socialMediaItemDTOs.map(socialMediaItemDTO => new SocialMediaItem(socialMediaItemDTO));
      },
      convertToDTOs: (socialMediaItems: SocialMediaItemInterface[]): SocialMediaItemDTO[] => {
        return socialMediaItems.map(socialMediaItem => ({
          id: socialMediaItem.id,
          i: socialMediaItem.icon,
          t: socialMediaItem.title,
          l: { a: socialMediaItem.link.app, u: socialMediaItem.link.url }
        }));
      },
      addSocialMedia: (items: SocialMediaItem[]) => {
        self.store.dispatch(SocialMediaActions.loadSocialMediaSuccess({ items }));
      },
      loadSocialMedia: (path: string, force: boolean = false) => {
        self.model.status$.pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          self.store.dispatch(SocialMediaActions.loadSocialMedia({ path: `${path}.json` }));
        });
      },
      getSocialMedia: (limit: number | null = null): SocialMediaItemInterface[] => {
        let socialMedia: SocialMediaItemInterface[] = [];

        this.model.socialMediaItems$.pipe(take(1)).subscribe(socialMediaItems => socialMedia = socialMediaItems);

        if(limit) {
          return [...socialMedia].splice(0, limit);
        }

        return socialMedia;
      },
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadSocialMedia: (path: string) => {
        return self.translationLoaderService.get<SocialMediaItemDTO[], null>(path, {}, null);
      }
    }
  }
}
