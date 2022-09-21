import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { ResumeTranslation } from '../../models/resume/resume.model';
import { ResumeService } from '../../services/resume/resume.service';
import * as ResumeActions from './resume.actions';
import * as fromResumeReducer from './resume.reducer';


@Injectable()
export class ResumeEffects {
  loadResume$ = createEffect(() => this.actions$.pipe(
    ofType(ResumeActions.loadResume),
    switchMap(action => {
      return this.resumeService.request.loadResume(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ResumeActions.loadResumeFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const resume = this.resumeService.business.convertDTO(response.data);
      return ResumeActions.loadResumeSuccess({ languageCode: response.append.languageCode, resume });
    })
  ));

  translateResume$ = createEffect(() => this.actions$.pipe(
    ofType(ResumeActions.translateResume),
    switchMap(action => {
      return this.resumeService.request.translateResume(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ResumeActions.translateResumeFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const resumeWrapper = this.resumeService.business.convertDTO(response.data);

      const translations: { education: UpdateNum<ResumeTranslation>[], experience: UpdateNum<ResumeTranslation>[] } = {
        education: resumeWrapper.education.map(education => ({
          id: education.id, changes: {
            translations: {
              [response.append.languageCode]: {
                description: education.description,
                title: education.title
              }
            }
          }
        })),
        experience: resumeWrapper.experience.map(experience => ({
          id: experience.id, changes: {
            translations: {
              [response.append.languageCode]: {
                description: experience.description,
                title: experience.title
              }
            }
          }
        }))
      }

      return ResumeActions.translateResumeSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromResumeReducer.State>, private resumeService: ResumeService) { }
}
