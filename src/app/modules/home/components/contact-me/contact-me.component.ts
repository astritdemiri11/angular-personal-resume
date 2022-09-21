import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { ResponseType } from 'ngx-material-translate';
import { filter, Subscription, take } from 'rxjs';

import { REQUEST_URL } from '../../constants/url.constant';
import { SocialMediaItem } from '../../models/social-media/social-media-item.interface';
import { ContactService } from '../../services/contact/contact.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'app-contact-me',
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss']
})
export class ContactMeComponent implements OnInit {
  socialMediaItems: SocialMediaItem[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    public contactService: ContactService,
    public socialMediaService: SocialMediaService) {
    this.socialMediaItems = [];
    this.subscriptions = [];
  }

  ngOnInit() {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.contactService.business.loadContact(`${serverUrl}/${feature.contact}`);
    this.socialMediaService.business.loadSocialMedia(`${serverUrl}/${feature.socialMedia}`);

    this.subscriptions.push(this.layoutService.model.handset$.subscribe(handset => {
      this.socialMediaService.model.status$.pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.socialMediaItems = this.socialMediaService.business.getSocialMedia(handset ? 5 : null);
      });
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
