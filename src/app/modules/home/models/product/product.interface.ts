export interface ProductDTO {
  id: number;
  d: string;
  i: string;
  t: string;
}

export interface Product {
  id: number;
  description: string;
  icon: string;
  title: string;
}

export interface ProductTranslation {
  product: Product;
  translations: {
    [languageCode: string]: {
      description: string;
      title: string;
    }
  };
}
