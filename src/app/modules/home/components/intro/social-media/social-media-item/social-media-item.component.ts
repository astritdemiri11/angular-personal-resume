import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LayoutService } from 'ngx-arrangement';
import { take } from 'rxjs';
import { MediaService } from 'src/app/modules/helpers/services/media/media.service';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { SocialMediaItem } from '../../../../models/social-media/social-media-item.interface';

@Component({
  selector: 'app-social-media-item',
  templateUrl: './social-media-item.component.html',
  styleUrls: ['./social-media-item.component.scss']
})
export class SocialMediaItemComponent {
  @Input() @Required('app-social-media-item') item?: SocialMediaItem;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private domSanitizer: DomSanitizer,
    private layoutService: LayoutService,
    private mediaService: MediaService) { }

  sanitizeLink() {
    let result: SafeResourceUrl = '';

    this.mediaService.model.appMode$.pipe(take(1)).subscribe(appMode => {
      if (this.item) {
        if (this.layoutService.business.isHandset() && appMode && this.item.link.app) {
          result = this.domSanitizer.bypassSecurityTrustResourceUrl(this.item.link.app);
        } else {
          result = this.domSanitizer.bypassSecurityTrustResourceUrl(this.item.link.url);
        }
      }
    });

    return result;
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
