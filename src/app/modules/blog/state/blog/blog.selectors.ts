import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { Blog, BlogTranslation } from 'src/app/modules/helpers/models/blog/blog.interface';

import { selectBlogParentState, State } from '..';
import { adapter, State as BlogState } from './blog.reducer';

export const selectBlogState = createSelector(selectBlogParentState, (state: State) => {
  return state.blog
});

const {
  selectAll,
} = adapter.getSelectors(selectBlogState);

export const selectBlogs = (languageCode: LanguageCode) => createSelector(
  selectBlogState,
  selectAll,
  (_state: BlogState, blogTranslations: BlogTranslation[]): (Blog | null)[] => blogTranslations.map(blogTranslation => {
    const translation = blogTranslation.translations[languageCode];

    if (!translation) {
      return null;
    }

    const content = blogTranslation.content[languageCode];

    return { ...blogTranslation.blog, description: translation, content }
  })
);

export const selectBlogByName = (name: string, languageCode: LanguageCode) => createSelector(
  selectBlogState,
  selectAll,
  (_state: BlogState, blogTranslations: BlogTranslation[]): Blog | null => {
    const blogTranslation = blogTranslations.find(blogTranslation => blogTranslation.blog.name === name);

    if (!blogTranslation) {
      return null;
    }

    const translation = blogTranslation.translations[languageCode];

    if (!translation) {
      return null;
    }

    const content = blogTranslation.content[languageCode];

    return { ...blogTranslation.blog, description: translation, content }
  }
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectBlogState,
  (state: BlogState) => state.status[languageCode]
);
