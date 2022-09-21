import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import {
  PortfolioItem as Project,
  PortfolioItemTranslation as ProjectTranslation,
} from 'src/app/modules/helpers/models/portfolio/portfolio-item.model';

export const loadProjects = createAction('[NODE-PROJECT] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadProjectsSuccess = createAction('[NODE-PROJECT] LOAD_SUCCESS', props<{ languageCode: LanguageCode, items: Project[] }>());
export const loadProjectsFailure = createAction('[NODE-PROJECT] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateProjects = createAction('[NODE-PROJECT] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateProjectsSuccess = createAction('[NODE-PROJECT] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<ProjectTranslation>[] }>());
export const translateProjectsFailure = createAction('[NODE-PROJECT] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const loadProjectContent = createAction('[NODE-PROJECT] LOAD-CONTENT', props<{ path: string, name: string, languageCode: LanguageCode }>());
export const loadProjectContentSuccess = createAction('[NODE-PROJECT] LOAD-CONTENT_SUCCESS', props<{ name: string, languageCode: LanguageCode, content: string }>());
export const loadProjectContentFailure = createAction('[NODE-PROJECT] LOAD-CONTENT_FAILURE', props<{ name: string, languageCode: LanguageCode, error: string }>());
