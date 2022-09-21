import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { PortfolioItem, PortfolioItemTranslation } from '../../../helpers/models/portfolio/portfolio-item.model';

export const loadPortfolio = createAction('[HOME_PORTFOLIO] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadPortfolioSuccess = createAction('[HOME_PORTFOLIO] LOAD_SUCCESS', props<{ languageCode: LanguageCode, items: PortfolioItem[] }>());
export const loadPortfolioFailure = createAction('[HOME_PORTFOLIO] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translatePortfolio = createAction('[HOME_PORTFOLIO] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translatePortfolioSuccess = createAction('[HOME_PORTFOLIO] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<PortfolioItemTranslation>[] }>());
export const translatePortfolioFailure = createAction('[HOME_PORTFOLIO] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());
