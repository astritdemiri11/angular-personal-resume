import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { SkillTranslation as SkillTranslationInterface } from '../../models/skill/skill.interface';
import { SkillTranslation } from '../../models/skill/skill.model';
import * as SkillActions from './skill.actions';

export interface State extends EntityState<SkillTranslationInterface> {
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(skillTranslation: SkillTranslationInterface): number {
  return skillTranslation.skill.id;
}

export function sortByName(aSkillTranslation: SkillTranslationInterface, bSkillTranslation: SkillTranslationInterface): number {
  return aSkillTranslation.skill.id - bSkillTranslation.skill.id
  // return aSkill.name.localeCompare(bSkill.name);
}

export const adapter: EntityAdapter<SkillTranslationInterface> = createEntityAdapter<SkillTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const skillReducer = createReducer(
  initialState,

  on(SkillActions.loadSkills, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(SkillActions.loadSkillsSuccess, (state: State, { languageCode, skills }) => {
    const copyState = adapter.setAll(skills.map(skill => new SkillTranslation(languageCode, skill)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(SkillActions.loadSkillsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(SkillActions.translateSkills, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(SkillActions.translateSkillsSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateNum<SkillTranslation>[] = [];

    for (const languageTranslation of translations) {
      const entity = { ...state.entities[languageTranslation.id] };
      const update = { ...languageTranslation };

      update.changes = { ...languageTranslation.changes };
      update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

      updates.push(update);
    }

    const copyState = adapter.updateMany(updates, state);

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(SkillActions.translateSkillsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return skillReducer(state, action);
}

export const featureKey = 'skill';
