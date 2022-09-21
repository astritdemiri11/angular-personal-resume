import { LanguageCode } from 'ngx-material-translate';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Blog as BlogInterface, BlogDTO, BlogTranslation as BlogTranslationInterface } from './blog.interface';

export class Blog implements BlogInterface {
  id: number;
  content: string;
  creator: string;
  date: Date;
  description: string;
  image: string;
  name: string;
  link: string;
  videoMode: boolean;

  constructor(blogDTO: BlogDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.id = blogDTO.id;
    this.content = '';
    this.creator = blogDTO.c;
    this.date = new Date(blogDTO.d);
    this.description = blogDTO.b;
    this.image = blogDTO.i;
    this.link = blogDTO.l;
    this.name = blogDTO.n;
    this.videoMode = blogDTO.v;
  }
}

export class BlogTranslation implements BlogTranslationInterface {
  content: { [languageCode: string]: string; };
  translations: { [blogCode: string]: string; };

  constructor(languageCode: LanguageCode, public blog: BlogInterface) {
    this.content = { [languageCode]: '' };

    this.translations = {
      [languageCode]: blog.description
    };
  }
}
