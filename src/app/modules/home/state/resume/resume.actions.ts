import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { ResumeTranslation, ResumeWrapper } from '../../models/resume/resume.model';

export const loadResume = createAction('[HOME_RESUME] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadResumeSuccess = createAction('[HOME_RESUME] LOAD_SUCCESS', props<{ languageCode: LanguageCode, resume: ResumeWrapper }>());
export const loadResumeFailure = createAction('[HOME_RESUME] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateResume = createAction('[HOME_RESUME] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateResumeSuccess = createAction('[HOME_RESUME] TRANSLATE_SUCCESS',
  props<{ languageCode: LanguageCode, translations: { education: UpdateNum<ResumeTranslation>[], experience: UpdateNum<ResumeTranslation>[] } }>());
export const translateResumeFailure = createAction('[HOME_RESUME] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());
