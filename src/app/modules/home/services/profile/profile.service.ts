import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Profile as ProfileInterface, ProfileDTO } from '../../models/profile/profile.interface';
import { Profile } from '../../models/profile/profile.model';
import * as ProfileActions from '../../state/profile/profile.actions';
import * as fromProfileReducer from '../../state/profile/profile.reducer';
import * as ProfileSelectors from '../../state/profile/profile.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromProfileReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(ProfileSelectors.selectProfileState),
      profile: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProfileSelectors.selectProfile(languageCode))
      },
      lastProfile: () => {
        const languageCode = this.languageService.business.getLastActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProfileSelectors.selectProfile(languageCode))
      },
      status: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProfileSelectors.selectStatus(languageCode))
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTO: (profileDTO: ProfileDTO) => {
        return new Profile(profileDTO);
      },
      convertToDTO: (profile: ProfileInterface): ProfileDTO => {
        return {
          n: profile.name,
          s: profile.surname,
          b: profile.bio,
          d: profile.birthday.toISOString(),
          p: profile.profession,
          l: profile.languages
        }
      },
      addProfile: (profile: Profile) => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('Cannot load profile without setting a default language!')
        }

        self.store.dispatch(ProfileActions.loadProfileSuccess({ languageCode, profile }));
      },
      loadProfile: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load profile without setting a default language!')
          }

          self.store.dispatch(ProfileActions.loadProfile({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      getProfile: (): ProfileInterface | null => {
        let profile: ProfileInterface | null = null;

        this.model.profile().pipe(take(1)).subscribe(stateProfile => profile = stateProfile);

        if (!profile) {
          this.model.lastProfile().pipe(take(1)).subscribe(stateProfile => profile = stateProfile);
        }

        return profile;
      },
      translateProfile: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot translate profile without setting a default language!')
          }

          self.store.dispatch(ProfileActions.translateProfile({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      isLoading: () => {
        let isLoading = false;

        self.model.status().pipe(take(1)).subscribe(status => isLoading = status === ResponseType.Loading);

        return isLoading;
      },
      isLoaded: () => {
        let isLoaded = false;

        self.model.status().pipe(take(1)).subscribe(status => isLoaded = status === ResponseType.Success);

        return isLoaded;
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadProfile: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ProfileDTO, { languageCode: LanguageCode }>(path, {}, { languageCode });
      },
      translateProfile: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ProfileDTO, { languageCode: LanguageCode }>(path, {}, { languageCode });
      }
    }
  }
}
