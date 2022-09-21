import { LanguageCode } from 'ngx-material-translate';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { PortfolioType } from './portfolio-item.enum';
import {
  PortfolioItem as PortfolioItemInterface,
  PortfolioItemDTO,
  PortfolioItemTranslation as PortfolioItemTranslationInterface,
} from './portfolio-item.interface';

export class PortfolioItem implements PortfolioItemInterface {
  id: number;
  content: string;
  link: string;
  name: string;
  source: string;
  subtitle: string;
  title: string;
  type: PortfolioType;

  constructor(portfolioItemDTO: PortfolioItemDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.id = portfolioItemDTO.id;
    this.content = '';
    this.link = portfolioItemDTO.l;
    this.name = portfolioItemDTO.n;
    this.source = portfolioItemDTO.i;
    this.subtitle = portfolioItemDTO.s;
    this.title = portfolioItemDTO.t;
    this.type = portfolioItemDTO.d;
  }
}

export class PortfolioItemTranslation implements PortfolioItemTranslationInterface {
  content: { [languageCode: string]: string; };
  translations: { [languageCode: string]: { subtitle: string; title: string; }; };

  constructor(languageCode: LanguageCode, public item: PortfolioItem) {
    this.content = { [languageCode]: '' };

    this.translations = {
      [languageCode]: {
        subtitle: item.subtitle,
        title: item.title
      }
    };
  }
}
