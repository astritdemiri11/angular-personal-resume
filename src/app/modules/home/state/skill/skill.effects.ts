import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { SkillTranslation } from '../../models/skill/skill.model';
import { SkillService } from '../../services/skill/skill.service';
import * as SkillActions from './skill.actions';
import * as fromSkillReducer from './skill.reducer';


@Injectable()
export class SkillEffects {
  loadSkill$ = createEffect(() => this.actions$.pipe(
    ofType(SkillActions.loadSkills),
    switchMap(action => {
      return this.skillService.request.loadSkills(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(SkillActions.loadSkillsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const skills = this.skillService.business.convertDTOs(response.data);
      return SkillActions.loadSkillsSuccess({ languageCode: response.append.languageCode, skills });
    })
  ));

  translateSkill$ = createEffect(() => this.actions$.pipe(
    ofType(SkillActions.translateSkills),
    switchMap(action => {
      return this.skillService.request.translateSkills(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(SkillActions.translateSkillsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const skills = this.skillService.business.convertDTOs(response.data);
      const translations: UpdateNum<SkillTranslation>[] = skills.map(skill => ({
        id: skill.id, changes: {
          translations: {
            [response.append.languageCode]: skill.title
          }
        }
      }));

      return SkillActions.translateSkillsSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromSkillReducer.State>, private skillService: SkillService) {}
}
