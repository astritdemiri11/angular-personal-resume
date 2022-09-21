import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { Skill, SkillTranslation } from '../../models/skill/skill.model';

export const loadSkills = createAction('[HOME_SKILL] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadSkillsSuccess = createAction('[HOME_SKILL] LOAD_SUCCESS', props<{ languageCode: LanguageCode, skills: Skill[] }>());
export const loadSkillsFailure = createAction('[HOME_SKILL] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateSkills = createAction('[HOME_SKILL] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateSkillsSuccess = createAction('[HOME_SKILL] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<SkillTranslation>[] }>());
export const translateSkillsFailure = createAction('[HOME_SKILL] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());
