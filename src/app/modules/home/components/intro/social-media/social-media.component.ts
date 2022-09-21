import { Component, Input } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { SocialMediaItem } from '../../../models/social-media/social-media-item.interface';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent {
  constructor(public layoutService: LayoutService) {}

  @Input() @Required('app-social-media') socialMediaItems?: SocialMediaItem[] | null;
}
