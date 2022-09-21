import { PortfolioType } from './portfolio-item.enum';

export interface PortfolioItemDTO {
  id: number;
  d: PortfolioType;
  i: string;
  l: string;
  n: string;
  s: string;
  t: string;
}

export interface PortfolioItem {
  id: number;
  content: string;
  source: string;
  link: string;
  name: string;
  subtitle: string;
  title: string;
  type: PortfolioType;
}

export interface PortfolioItemTranslation {
  item: PortfolioItem;
  content: {
    [languageCode: string]: string;
  };
  translations: {
    [languageCode: string]: {
      subtitle: string;
      title: string;
    }
  };
}
