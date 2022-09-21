import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { selectHomeState, State } from '..';
import { Skill, SkillTranslation } from '../../models/skill/skill.interface';
import { adapter, State as SkillState } from './skill.reducer';

export const selectSkillState = createSelector(selectHomeState, (state: State) => {
  return state.skill
});

const {
  selectAll
} = adapter.getSelectors(selectSkillState);

export const selectSkills = (languageCode: LanguageCode) => createSelector(
  selectSkillState,
  selectAll,
  (_state: SkillState, skillTranslations: SkillTranslation[]): (Skill | null)[] => skillTranslations.map(skillTranslation => {
    const translation = skillTranslation.translations[languageCode];

    if(!translation) {
      return null;
    }

    return { ...skillTranslation.skill, title: translation }
  })
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectSkillState,
  (state: SkillState) => state.status[languageCode]
);
