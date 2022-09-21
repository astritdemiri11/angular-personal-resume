import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService, ResponseType } from 'ngx-material-translate';
import { filter, Subscription, take } from 'rxjs';
import { THEME_COLOR_MAP } from 'src/app/core/constants/theme.constant';
import { SettingsService } from 'src/app/core/services/settings/settings.service';

import { REQUEST_URL } from '../../constants/url.constant';
import { Profile } from '../../models/profile/profile.interface';
import { ContactService } from '../../services/contact/contact.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  profile: Profile | null;
  imgSrc: string;

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    public contactService: ContactService,
    public profileService: ProfileService,
    private languageService: LanguageService,
    private settingsService: SettingsService) {
    this.profile = null;
    this.imgSrc = '';
    this.subscriptions = [];
  }

  calcImageHeight(self: HTMLElement) {
    if(this.layoutService.business.isHandset()) {
      return self.offsetWidth / 1.1 + 'px';
    }

    return 'auto';
  }

  ngOnInit() {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.contactService.business.loadContact(`${serverUrl}/${feature.contact}`);
    this.profileService.business.loadProfile(`${serverUrl}/${feature.profile.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.profileService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.profile = this.profileService.business.getProfile();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.profileService.business.translateProfile(`${serverUrl}/${feature.profile.translate}`);
      }
    }));

    this.subscriptions.push(this.settingsService.model.theme$.subscribe(theme => {
      this.imgSrc = `url(/assets/images/webp/profile-2_${THEME_COLOR_MAP[theme].primaryName}.webp)`;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
