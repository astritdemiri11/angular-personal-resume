import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Skill as SkillInterface, SkillDTO } from '../../models/skill/skill.interface';
import { Skill } from '../../models/skill/skill.model';
import * as SkillActions from '../../state/skill/skill.actions';
import * as fromSkillReducer from '../../state/skill/skill.reducer';
import * as SkillSelectors from '../../state/skill/skill.selectors';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromSkillReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

    private getModel() {
      return {
        state$: this.store.select(SkillSelectors.selectSkillState),
        skills: () => {
          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(SkillSelectors.selectSkills(languageCode))
        },
        lastSkills: () => {
          const languageCode = this.languageService.business.getLastActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(SkillSelectors.selectSkills(languageCode))
        },
        status: () => {
          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(SkillSelectors.selectStatus(languageCode))
        }
      }
    }

    private getBusiness() {
      const self = this;

      return {
        convertDTOs: (skillDTOs: SkillDTO[]) => {
          return skillDTOs.map(skillDTO => new Skill(skillDTO));
        },
        loadSkills: (path: string, force: boolean = false) => {
          self.model.status().pipe(take(1)).subscribe(status => {
            if(status === ResponseType.Loading) {
              return;
            }

            if (!force && status === ResponseType.Success) {
              return;
            }

            const languageCode = this.languageService.business.getActiveLanguageCode();

            if (!languageCode) {
              throw new Error('Cannot load skills without setting a default language!')
            }

            self.store.dispatch(SkillActions.loadSkills({ path: `${path}/${languageCode}.json`, languageCode }));
          });
        },
        getSkills: (): SkillInterface[] => {
          let skills: SkillInterface[] = [];

          this.model.skills().pipe(take(1)).subscribe(stateSkills => {
            if(!stateSkills.filter(skill => skill === null).length) {
              stateSkills.forEach(skill => {
                if(skill) {
                  skills.push(skill)
                }
              });
            }
          });

          if (!skills.length) {
            this.model.lastSkills().pipe(take(1)).subscribe(stateSkills => {
              stateSkills.forEach(skill => {
                if(skill) {
                  skills.push(skill)
                }
              });
            });
          }

          return skills;
        },
        translateSkills: (path: string, force: boolean = false) => {
          self.model.status().pipe(take(1)).subscribe(status => {
            if(status === ResponseType.Loading) {
              return;
            }

            if (!force && status === ResponseType.Success) {
              return;
            }

            const languageCode = this.languageService.business.getActiveLanguageCode();

            if (!languageCode) {
              throw new Error('Cannot translate skills without setting a default language!')
            }

            self.store.dispatch(SkillActions.translateSkills({ path: `${path}/${languageCode}.json`, languageCode }));
          });
        }
      }
    }

    private getRequest() {
      const self = this;

      return {
        loadSkills: (path: string, languageCode: LanguageCode) => {
          return self.translationLoaderService.get<SkillDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
        },
        translateSkills: (path: string, languageCode: LanguageCode) => {
          return self.translationLoaderService.get<SkillDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
        }
      }
    }
}
