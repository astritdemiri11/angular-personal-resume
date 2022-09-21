import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import { BlogTranslation } from 'src/app/modules/helpers/models/blog/blog.model';

import { BlogTranslation as BlogTranslationInterface } from '../../../helpers/models/blog/blog.interface';
import { ResponseType } from '../../models/response/response.enum';
import * as BlogActions from './blog.actions';

export interface State extends EntityState<BlogTranslationInterface> {
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(blogTranslation: BlogTranslationInterface): number {
  return blogTranslation.blog.id;
}

export function sortByName(aBlogTranslation: BlogTranslationInterface, bBlogTranslation: BlogTranslationInterface): number {
  return aBlogTranslation.blog.id - bBlogTranslation.blog.id
  // return aBlogTranslation.blog.name.localeCompare(bBlogTranslation.blog.name);
}

export const adapter: EntityAdapter<BlogTranslationInterface> = createEntityAdapter<BlogTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const blogReducer = createReducer(
  initialState,

  on(BlogActions.loadBlogs, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(BlogActions.loadBlogsSuccess, (state: State, { languageCode, items }) => {
    const copyState = adapter.setAll(items.map(item => new BlogTranslation(languageCode, item)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(BlogActions.loadBlogsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(BlogActions.translateBlogs, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(BlogActions.translateBlogsSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateNum<BlogTranslation>[] = [];

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
  on(BlogActions.translateBlogsFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(BlogActions.loadBlogContent, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.ContentLoading;

    return copyState;
  }),
  on(BlogActions.loadBlogContentSuccess, (state: State, { name, languageCode, content }) => {
    const stateEntity = Object.values(state.entities).find(entity => {
      if (entity) {
        return entity.blog.name === name;
      }

      return false;
    });

    if (stateEntity) {
      const entity = { ...stateEntity };
      const update: UpdateNum<BlogTranslationInterface> = {
        id: stateEntity.blog.id, changes: {
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
  on(BlogActions.loadBlogContentFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.ContentFailure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return blogReducer(state, action);
}

export const featureKey = 'blog';
