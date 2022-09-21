import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import {
  PortfolioItem as Library,
  PortfolioItemTranslation as LibraryTranslation,
} from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';

import { selectNgLibraryState, State } from '..';
import { adapter, State as LibraryState } from './library.reducer';

export const selectLibraryState = createSelector(selectNgLibraryState, (state: State) => {
  return state.library
});

const {
  selectAll,
} = adapter.getSelectors(selectLibraryState);

export const selectLibraries = (languageCode: LanguageCode) => createSelector(
  selectLibraryState,
  selectAll,
  (_state: LibraryState, libraryTranslations: LibraryTranslation[]): (Library | null)[] => libraryTranslations.map(libraryTranslation => {
    const translation = libraryTranslation.translations[languageCode];

    if (!translation) {
      return null;
    }

    const content = libraryTranslation.content[languageCode];

    return { ...libraryTranslation.item, ...translation, content }
  })
);

export const selectLibraryByName = (name: string, languageCode: LanguageCode) => createSelector(
  selectLibraryState,
  selectAll,
  (_state: LibraryState, libraryTranslations: LibraryTranslation[]): Library | null => {
    const libraryTranslation = libraryTranslations.find(libraryTranslation => libraryTranslation.item.name === name);

    if (!libraryTranslation) {
      return null;
    }

    const translation = libraryTranslation.translations[languageCode];

    if (!translation) {
      return null;
    }

    const content = libraryTranslation.content[languageCode];

    return { ...libraryTranslation.item, ...translation, content }
  }
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectLibraryState,
  (state: LibraryState) => state.status[languageCode]
);
