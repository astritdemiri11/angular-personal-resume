import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { Blog, BlogTranslation } from 'src/app/modules/helpers/models/blog/blog.interface';

import { selectHomeState, State } from '..';
import { adapter, State as BlogState } from './blog.reducer';

export const selectBlogState = createSelector(selectHomeState, (state: State) => {
  return state.blog
});

const {
  selectAll
} = adapter.getSelectors(selectBlogState);

export const selectBlogs = (languageCode: LanguageCode) => createSelector(
  selectBlogState,
  selectAll,
  (_state: BlogState, productTranslations: BlogTranslation[]): (Blog | null)[] => productTranslations.map(productTranslation => {
    const translation = productTranslation.translations[languageCode];

    if(!translation) {
      return null;
    }

    return { ...productTranslation.blog, description: translation }
  })
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectBlogState,
  (state: BlogState) => state.status[languageCode]
);
