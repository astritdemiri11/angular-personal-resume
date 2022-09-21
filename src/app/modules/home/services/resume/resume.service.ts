import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Resume as ResumeInterface, ResumeWrapperDTO } from '../../models/resume/resume.interface';
import { ResumeWrapper } from '../../models/resume/resume.model';
import * as ResumeActions from '../../state/resume/resume.actions';
import * as fromResumeReducer from '../../state/resume/resume.reducer';
import * as ResumeSelectors from '../../state/resume/resume.selectors';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromResumeReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(ResumeSelectors.selectResumeState),
      resume$: this.store.select(ResumeSelectors.selectResume),
      education: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ResumeSelectors.selectEducation(languageCode))
      },
      lastEducation: () => {
        const languageCode = this.languageService.business.getLastActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ResumeSelectors.selectEducation(languageCode))
      },
      experience: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ResumeSelectors.selectExperience(languageCode))
      },
      lastExperience: () => {
        const languageCode = this.languageService.business.getLastActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ResumeSelectors.selectExperience(languageCode))
      },
      status: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ResumeSelectors.selectStatus(languageCode))
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTO: (resumeWrapperDTO: ResumeWrapperDTO) => {
        return new ResumeWrapper(resumeWrapperDTO);
      },
      loadResume: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load resume without setting a default language!')
          }

          self.store.dispatch(ResumeActions.loadResume({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      getEducation: (): ResumeInterface[] => {
        let result: ResumeInterface[] = [];

        this.model.education().pipe(take(1)).subscribe(education => {
          if (!education.filter(resume => resume === null).length) {
            education.forEach(resume => {
              if (resume) {
                result.push(resume)
              }
            });
          }
        });

        if (!result.length) {
          this.model.lastEducation().pipe(take(1)).subscribe(education => {
            education.forEach(resume => {
              if (resume) {
                result.push(resume)
              }
            });
          });
        }

        return result;
      },
      getExperience: (): ResumeInterface[] => {
        let result: ResumeInterface[] = [];

        this.model.experience().pipe(take(1)).subscribe(experience => {
          if (!experience.filter(resume => resume === null).length) {
            experience.forEach(resume => {
              if (resume) {
                result.push(resume)
              }
            });
          }
        });

        if (!result.length) {
          this.model.lastExperience().pipe(take(1)).subscribe(experience => {
            experience.forEach(resume => {
              if (resume) {
                result.push(resume)
              }
            });
          });
        }

        return result;
      },
      translateResume: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot translate resume without setting a default language!')
          }

          self.store.dispatch(ResumeActions.translateResume({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadResume: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ResumeWrapperDTO, { languageCode: LanguageCode }>(path, {}, { languageCode });
      },
      translateResume: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ResumeWrapperDTO, { languageCode: LanguageCode }>(path, {}, { languageCode });
      }
    }
  }
}
