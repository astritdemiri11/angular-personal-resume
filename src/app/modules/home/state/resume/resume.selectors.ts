import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';

import { selectHomeState, State } from '..';
import { Resume, ResumeTranslation } from '../../models/resume/resume.interface';
import { adapter, State as ResumeState } from './resume.reducer';

export const selectResumeState = createSelector(selectHomeState, (state: State) => {
  return state.resume
});

const selectEducationState = createSelector(
  selectResumeState,
  (state: ResumeState) => state.resume.education
);

const selectExperienceState = createSelector(
  selectResumeState,
  (state: ResumeState) => state.resume.experience
);

const {
  selectAll: selectAllEducations
} = adapter.getSelectors(selectEducationState);

const {
  selectAll: selectAllExperiences
} = adapter.getSelectors(selectExperienceState);

export const selectResume = createSelector(
  selectResumeState,
  (state: ResumeState) => state.resume
);

export const selectEducation = (languageCode: LanguageCode) => createSelector(
  selectResumeState,
  selectAllEducations,
  (_state: ResumeState, resumeTranslations: ResumeTranslation[]): (Resume | null)[] => resumeTranslations.map(resumeTranslation => {
    const translation = resumeTranslation.translations[languageCode];

    if(!translation) {
      return null;
    }

    return { ...resumeTranslation.resume, ...translation }
  })
);

export const selectExperience = (languageCode: LanguageCode) => createSelector(
  selectResumeState,
  selectAllExperiences,
  (_state: ResumeState, resumeTranslations: ResumeTranslation[]): (Resume | null)[] => resumeTranslations.map(resumeTranslation => {
    const translation = resumeTranslation.translations[languageCode];

    if(!translation) {
      return null;
    }

    return { ...resumeTranslation.resume, ...translation }
  })
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectResumeState,
  (state: ResumeState) => state.status[languageCode]
);
