import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { ResumeTranslation } from '../../models/resume/resume.model';
import * as ResumeActions from './resume.actions';

export interface State {
  resume: {
    languages: string[];
    education: EntityState<ResumeTranslation>;
    experience: EntityState<ResumeTranslation>;
  };
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(resumeTranslation: ResumeTranslation): number {
  return resumeTranslation.resume.id;
}

export function sortByName(aResumeTranslation: ResumeTranslation, bResumeTranslation: ResumeTranslation): number {
  return aResumeTranslation.resume.id - bResumeTranslation.resume.id
  // return aResume.name.localeCompare(bResume.name);
}

export const adapter: EntityAdapter<ResumeTranslation> = createEntityAdapter<ResumeTranslation>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = {
  resume: {
    languages: [],
    education: adapter.getInitialState(),
    experience: adapter.getInitialState()
  },
  status: {},
  error: null
};

const resumeReducer = createReducer(
  initialState,

  on(ResumeActions.loadResume, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ResumeActions.loadResumeSuccess, (state: State, { languageCode, resume }) => {
    const copyState = { ...state, error: null };

    copyState.resume = {
      ...state.resume,
      education: adapter.setAll(resume.education.map(education => new ResumeTranslation(languageCode, education)), state.resume.education),
      experience: adapter.setAll(resume.experience.map(experience => new ResumeTranslation(languageCode, experience)), state.resume.experience)
    }

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(ResumeActions.loadResumeFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(ResumeActions.translateResume, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ResumeActions.translateResumeSuccess, (state: State, { languageCode, translations }) => {
    const updates: { education: UpdateNum<ResumeTranslation>[], experience: UpdateNum<ResumeTranslation>[] } = {
      education: [],
      experience: []
    };

    const oldState = { ...state };
    const oldResume = { ...oldState.resume };

    for (const languageTranslation of translations.education) {
      const oldEducation = { ...oldResume.education };
      const entity = { ...oldEducation.entities[languageTranslation.id] };
      const update = { ...languageTranslation };

      update.changes = { ...languageTranslation.changes };
      update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

      updates.education.push(update);
    }

    for (const languageTranslation of translations.experience) {
      const oldExperience = { ...oldResume.experience };
      const entity = { ...oldExperience.entities[languageTranslation.id] };
      const update = { ...languageTranslation };

      update.changes = { ...languageTranslation.changes };
      update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

      updates.experience.push(update);
    }

    const copyState = {
      ...state, resume: {
        ...state.resume,
        education: adapter.updateMany(updates.education, state.resume.education),
        experience: adapter.updateMany(updates.experience, state.resume.experience)
      }
    };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(ResumeActions.translateResumeFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return resumeReducer(state, action);
}

export const featureKey = 'resume';
