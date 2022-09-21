import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  PortfolioItemTranslation as ProjectTranslation,
} from 'src/app/modules/helpers/models/portfolio/portfolio-item.model';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { ProjectService } from '../../services/project/project.service';
import * as ProjectActions from './project.actions';
import * as fromProjectReducer from './project.reducer';

@Injectable()
export class ProjectEffects {
  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.loadProjects),
    switchMap(action => {
      return this.projectService.request.loadProjects(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ProjectActions.loadProjectsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const items = this.projectService.business.convertDTOs(response.data);
      return ProjectActions.loadProjectsSuccess({ languageCode: response.append.languageCode, items });
    })
  ));

  loadProjectContent$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.loadProjectContent),
    switchMap(action => {
      return this.projectService.request.loadProjectContent(action.path, action.name, action.languageCode);
    }),
    catchError((error: CustomError<{ name: string, languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ProjectActions.loadProjectContentFailure({ name: error.append.name, languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      return ProjectActions.loadProjectContentSuccess({ name: response.append.name, languageCode: response.append.languageCode, content: response.data });
    })
  ));

  translateProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectActions.translateProjects),
    switchMap(action => {
      return this.projectService.request.translateProjects(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ProjectActions.translateProjectsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const projects = this.projectService.business.convertDTOs(response.data);
      const translations: UpdateNum<ProjectTranslation>[] = projects.map(project => ({
        id: project.id, changes: {
          translations: {
            [response.append.languageCode]: {
              subtitle: project.subtitle,
              title: project.title
            }
          }
        }
      }));

      return ProjectActions.translateProjectsSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));

  constructor(private actions$: Actions, private store: Store<fromProjectReducer.State>, private projectService: ProjectService) {}
}
