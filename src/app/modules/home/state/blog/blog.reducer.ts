import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';
import { BlogTranslation as BlogTranslationInterface } from 'src/app/modules/helpers/models/blog/blog.interface';
import { BlogTranslation } from 'src/app/modules/helpers/models/blog/blog.model';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

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
  // return aBlog.name.localeCompare(bBlog.name);
}

export const adapter: EntityAdapter<BlogTranslationInterface> = createEntityAdapter<BlogTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  status: {},
  error: null
});

const blogReducer = createReducer(initialState,
  on(BlogActions.loadBlogs, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(BlogActions.loadBlogsSuccess, (state: State, { languageCode, blogs }) => {
    const copyState = adapter.setAll(blogs.map(blog => new BlogTranslation(languageCode, blog)), { ...state, error: null });

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

    for (const blogTranslation of translations) {
      const entity = { ...state.entities[blogTranslation.id] };
      const update = { ...blogTranslation };

      update.changes = { ...blogTranslation.changes };
      update.changes.translations = { ...blogTranslation.changes.translations, ...entity.translations }

      updates.push(update);
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
  }));

export function reducer(state: State | undefined, action: Action) {
  return blogReducer(state, action);
}

export const featureKey = 'blog';
