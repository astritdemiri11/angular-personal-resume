import { createSelector } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import {
  PortfolioItem as Project,
  PortfolioItemTranslation as ProjectTranslation,
} from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';

import { selectNodeProjectState, State } from '..';
import { adapter, State as ProjectState } from './project.reducer';

export const selectProjectState = createSelector(selectNodeProjectState, (state: State) => {
  return state.project
});

const {
  selectAll,
} = adapter.getSelectors(selectProjectState);

export const selectProjects = (languageCode: LanguageCode) => createSelector(
  selectProjectState,
  selectAll,
  (_state: ProjectState, projectTranslations: ProjectTranslation[]): (Project | null)[] => projectTranslations.map(projectTranslation => {
    const translation = projectTranslation.translations[languageCode];

    if (!translation) {
      return null;
    }

    const content = projectTranslation.content[languageCode];

    return { ...projectTranslation.item, ...translation, content }
  })
);

export const selectProjectByName = (name: string, languageCode: LanguageCode) => createSelector(
  selectProjectState,
  selectAll,
  (_state: ProjectState, projectTranslations: ProjectTranslation[]): Project | null => {
    const projectTranslation = projectTranslations.find(projectTranslation => projectTranslation.item.name === name);

    if (!projectTranslation) {
      return null;
    }

    const translation = projectTranslation.translations[languageCode];

    if (!translation) {
      return null;
    }

    const content = projectTranslation.content[languageCode];

    return { ...projectTranslation.item, ...translation, content }
  }
);

export const selectStatus = (languageCode: LanguageCode) => createSelector(
  selectProjectState,
  (state: ProjectState) => state.status[languageCode]
);
