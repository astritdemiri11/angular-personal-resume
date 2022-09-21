import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { Product, ProductTranslation } from '../../models/product/product.model';

export const loadProducts = createAction('[HOME_PRODUCT] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadProductsSuccess = createAction('[HOME_PRODUCT] LOAD_SUCCESS', props<{ languageCode: LanguageCode, products: Product[] }>());
export const loadProductsFailure = createAction('[HOME_PRODUCT] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateProducts = createAction('[HOME_PRODUCT] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateProductsSuccess = createAction('[HOME_PRODUCT] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<ProductTranslation>[] }>());
export const translateProductsFailure = createAction('[HOME_PRODUCT] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());
