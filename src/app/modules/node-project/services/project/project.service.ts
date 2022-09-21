import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import {
  PortfolioItem as ProjectInterface,
  PortfolioItemDTO as ProjectDTO,
} from '../../../helpers/models/portfolio/portfolio-item.interface';
import { PortfolioItem as Project } from '../../../helpers/models/portfolio/portfolio-item.model';
import * as ProjectActions from '../../state/project/project.actions';
import * as fromProjectReducer from '../../state/project/project.reducer';
import * as ProjectSelectors from '../../state/project/project.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromProjectReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(ProjectSelectors.selectProjectState),
      projects: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProjectSelectors.selectProjects(languageCode))
      },
      lastProjects: () => {
        const languageCode = this.languageService.business.getLastActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProjectSelectors.selectProjects(languageCode))
      },
      projectByName: (name: string) => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProjectSelectors.selectProjectByName(name, languageCode))
      },
      status: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProjectSelectors.selectStatus(languageCode))
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTOs: (projectDTOs: ProjectDTO[]) => {
        return projectDTOs.map(projectDTO => new Project(projectDTO));
      },
      loadProjects: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load projects without setting a default language!')
          }

          self.store.dispatch(ProjectActions.loadProjects({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      loadProjectContent: (path: string, name: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          const project = this.business.getProjectByName(name);

          if (!force && (project && project.content)) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load project content without setting a default language!')
          }

          self.store.dispatch(ProjectActions.loadProjectContent({ path: `${path}/${name}/${languageCode}.html`, name, languageCode }));
        });
      },
      getProjectByName: (name: string): ProjectInterface | null => {
        let project: ProjectInterface | null = null;

        self.model.projectByName(name).pipe(take(1)).subscribe(stateProject => project = stateProject)

        return project;
      },
      getProjects: (): ProjectInterface[] => {
        let projects: ProjectInterface[] = [];

        this.model.projects().pipe(take(1)).subscribe(stateProjects => {
          if (!stateProjects.filter(project => project === null).length) {
            stateProjects.forEach(project => {
              if (project) {
                projects.push(project)
              }
            });
          }
        });

        if (!projects.length) {
          this.model.lastProjects().pipe(take(1)).subscribe(stateProjects => {
            stateProjects.forEach(project => {
              if (project) {
                projects.push(project)
              }
            });
          });
        }

        return projects;
      },
      translateProjects: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot translate projects without setting a default language!')
          }

          self.store.dispatch(ProjectActions.translateProjects({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadProjects: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ProjectDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      },
      loadProjectContent: (path: string, name: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<string, { name: string, languageCode: LanguageCode }>(path, { responseType: 'text' }, { name, languageCode });
      },
      translateProjects: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ProjectDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      }
    }
  }
}
