import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import {
  PortfolioItemTranslation as ProjectTranslation,
} from 'src/app/modules/helpers/models/portfolio/portfolio-item.model';

import { PortfolioType as ProjectType } from '../../../helpers/models/portfolio/portfolio-item.enum';
import {
  PortfolioItemTranslation as ProjectTranslationInterface,
} from '../../../helpers/models/portfolio/portfolio-item.interface';
import { ResponseType } from '../../models/response/response.enum';
import * as ProjectActions from './project.actions';

export interface State extends EntityState<ProjectTranslationInterface> {
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(projectTranslation: ProjectTranslationInterface): number {
  return projectTranslation.item.id;
}

export function sortByName(aProjectTranslation: ProjectTranslationInterface, bProjectTranslation: ProjectTranslationInterface): number {
  return aProjectTranslation.item.id - bProjectTranslation.item.id
  // return aProjectTranslation.item.name.localeCompare(bProjectTranslation.item.name);
}

export const adapter: EntityAdapter<ProjectTranslationInterface> = createEntityAdapter<ProjectTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const projectReducer = createReducer(
  initialState,

  on(ProjectActions.loadProjects, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ProjectActions.loadProjectsSuccess, (state: State, { languageCode, items }) => {
    items = items.filter(item => item.type === ProjectType.NodeProject);

    const copyState = adapter.setAll(items.map(item => new ProjectTranslation(languageCode, item)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(ProjectActions.loadProjectsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(ProjectActions.translateProjects, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(ProjectActions.translateProjectsSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateNum<ProjectTranslation>[] = [];

    for (const languageTranslation of translations) {
      const stateEntity = state.entities[languageTranslation.id];

      if (stateEntity) {
        const entity = { ...stateEntity };
        const update = { ...languageTranslation };

        update.changes = { ...languageTranslation.changes };
        update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

        updates.push(update);
      }
    }

    const copyState = adapter.updateMany(updates, state);

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(ProjectActions.translateProjectsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(ProjectActions.loadProjectContent, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.ContentLoading;

    return copyState;
  }),
  on(ProjectActions.loadProjectContentSuccess, (state: State, { name, languageCode, content }) => {
    const stateEntity = Object.values(state.entities).find(entity => {
      if (entity) {
        return entity.item.name === name;
      }

      return false;
    });

    if (stateEntity) {
      const entity = { ...stateEntity };
      const update: UpdateNum<ProjectTranslationInterface> = {
        id: stateEntity.item.id, changes: {
          content: { ...entity.content, ...{ [languageCode]: content } },
          translations: { ...entity.translations }
        }
      };

      const copyState = adapter.updateOne(update, state);

      copyState.status = { ...copyState.status };
      copyState.status[languageCode] = ResponseType.ContentSuccess;

      return copyState;
    }

    return state;
  }),
  on(ProjectActions.loadProjectContentFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.ContentFailure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return projectReducer(state, action);
}

export const featureKey = 'project';
