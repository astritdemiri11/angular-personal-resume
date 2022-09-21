import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { SocialMediaItem as SocialMediaItemInterface, SocialMediaItemDTO } from './social-media-item.interface';

export class SocialMediaItem implements SocialMediaItemInterface {
  id: number;
  icon: string;
  title: string;
  link: { app: string; url: string };

  constructor(socialMediaItemDTO: SocialMediaItemDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.id = socialMediaItemDTO.id;
    this.icon = socialMediaItemDTO.i;
    this.title = socialMediaItemDTO.t;
    this.link = socialMediaItemDTO.l ? { app: socialMediaItemDTO.l.a, url: socialMediaItemDTO.l.u } : { app: '', url: '' };
  }
}
