import { LanguageCode } from 'ngx-material-translate';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Product as ProductInterface, ProductTranslation as ProductTranslationInterface, ProductDTO } from './product.interface';

export class Product implements ProductInterface {
  id: number;
  description: string;
  title: string;
  icon: string;

  constructor(productDTO: ProductDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.id = productDTO.id;
    this.description = productDTO.d;
    this.title = productDTO.t;
    this.icon = productDTO.i;
  }
}

export class ProductTranslation implements ProductTranslationInterface {
  translations: { [languageCode: string]: { description: string; title: string }; };

  constructor(languageCode: LanguageCode, public product: Product) {
    this.translations = {
      [languageCode]: {
        description: product.description,
        title: product.title
      }
    };
  }
}
