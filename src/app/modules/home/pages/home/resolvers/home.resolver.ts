import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { KeyValue, TranslateService } from 'ngx-material-translate';
import { filter, firstValueFrom, take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { REQUEST_URL } from '../../../constants/url.constant';
import { ContactDTO } from '../../../models/contact/contact.interface';
import { ProfileDTO } from '../../../models/profile/profile.interface';
import { SocialMediaItemDTO } from '../../../models/social-media/social-media-item.interface';
import { ContactService } from '../../../services/contact/contact.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { SocialMediaService } from '../../../services/social-media/social-media.service';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<boolean> {
  constructor(
    private transferState: TransferState,
    private layoutService: LayoutService,
    private translateService: TranslateService,
    private contactService: ContactService,
    private profileService: ProfileService,
    private socialMediaService: SocialMediaService) { }

  async resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean> {
    const homeTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey('home.translations'), null);

    if (homeTranslations) {
      this.translateService.business.addTranslations(homeTranslations, 'home');
    } else {
      this.translateService.business.loadTranslations('home');

      if (!this.layoutService.model.isBrowser) {
        const translationsLoaded$ = this.translateService.model.status('home').pipe(
          filter(status => status === ResponseType.Success),
          take(1));

        await firstValueFrom(translationsLoaded$);

        this.translateService.model.languageTranslations('home').pipe(take(1)).subscribe(homeTranslations => {
          if (homeTranslations) {
            this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey('home.translations'), homeTranslations);
          }
        });

        const serverUrl = REQUEST_URL.host;
        const feature = REQUEST_URL.json;

        this.profileService.business.loadProfile(`${serverUrl}/${feature.profile.load}`);

        const profileLoaded$ = this.profileService.model.status().pipe(
          filter(response => response === ResponseType.Success),
          take(1));

        await firstValueFrom(profileLoaded$);

        this.profileService.model.profile().pipe(take(1)).subscribe(profile => {
          if (profile) {
            this.transferState.set<ProfileDTO>(makeStateKey('profile'), this.profileService.business.convertToDTO(profile));
          }
        });

        this.socialMediaService.business.loadSocialMedia(`${serverUrl}/${feature.socialMedia}`);

        const socialMediaLoaded$ = this.socialMediaService.model.status$.pipe(
          filter(response => response === ResponseType.Success),
          take(1));

        await firstValueFrom(socialMediaLoaded$);

        this.socialMediaService.model.socialMediaItems$.pipe(take(1)).subscribe(socialMediaItems => {
          if (socialMediaItems) {
            this.transferState.set<SocialMediaItemDTO[]>(makeStateKey('socialMedia'), this.socialMediaService.business.convertToDTOs(socialMediaItems));
          }
        });

        this.contactService.business.loadContact(`${serverUrl}/${feature.contact}`);

        const contactLoaded$ = this.contactService.model.status$.pipe(
          filter(response => response === ResponseType.Success),
          take(1));

        await firstValueFrom(contactLoaded$);

        this.contactService.model.contact$.pipe(take(1)).subscribe(contact => {
          if (contact) {
            this.transferState.set<ContactDTO>(makeStateKey('contact'), this.contactService.business.convertToDTO(contact));
          }
        });
      }
    }

    return new Promise<boolean>(resolve => {
      resolve(true)
    });
  }
}
