import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import {
  PortfolioItem as Library,
  PortfolioItemTranslation as LibraryTranslation,
} from 'src/app/modules/helpers/models/portfolio/portfolio-item.model';

export const loadLibraries = createAction('[NG-LIBRARY] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadLibrariesSuccess = createAction('[NG-LIBRARY] LOAD_SUCCESS', props<{ languageCode: LanguageCode, items: Library[] }>());
export const loadLibrariesFailure = createAction('[NG-LIBRARY] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateLibraries = createAction('[NG-LIBRARY] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateLibrariesSuccess = createAction('[NG-LIBRARY] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<LibraryTranslation>[] }>());
export const translateLibrariesFailure = createAction('[NG-LIBRARY] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const loadLibraryContent = createAction('[NG-LIBRARY] LOAD-CONTENT', props<{ path: string, name: string, languageCode: LanguageCode }>());
export const loadLibraryContentSuccess = createAction('[NG-LIBRARY] LOAD-CONTENT_SUCCESS', props<{ name: string, languageCode: LanguageCode, content: string }>());
export const loadLibraryContentFailure = createAction('[NG-LIBRARY] LOAD-CONTENT_FAILURE', props<{ name: string, languageCode: LanguageCode, error: string }>());
