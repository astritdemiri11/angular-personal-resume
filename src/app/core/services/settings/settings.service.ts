import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutService } from 'ngx-arrangement';
import { take } from 'rxjs';
import { MediaService } from 'src/app/modules/helpers/services/media/media.service';

import { ThemeType } from '../../models/theme/theme.enum';
import * as SettingsActions from '../../state/settings/settings.actions';
import * as fromSettingsReducer from '../../state/settings/settings.reducer';
import * as SettingsSelectors from '../../state/settings/settings.selectors';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  model = this.getModel();
  business = this.getBusiness();

  constructor(
    private store: Store<fromSettingsReducer.State>,
    private layoutService: LayoutService,
    private mediaService: MediaService
  ) { }

  private getModel() {
    return {
      state$: this.store.select(SettingsSelectors.selectLayoutState),
      appMode$: this.store.select(SettingsSelectors.selectAppMode),
      lastTheme$: this.store.select(SettingsSelectors.selectLastTheme),
      theme$: this.store.select(SettingsSelectors.selectTheme)
    }
  }

  private getBusiness() {
    const self = this;

    return {
      isLinkAppMode(): boolean {
        let appMode = false;

        self.model.appMode$.pipe(take(1)).subscribe(mode => appMode = mode);

        return appMode;
      },
      getActiveTheme(): ThemeType {
        let active = ThemeType.Undefined;

        self.model.theme$.pipe(take(1)).subscribe(activeCode => active = activeCode);

        return active;
      },
      getLastActiveTheme(): ThemeType {
        let active = ThemeType.Undefined;

        self.model.lastTheme$.pipe(take(1)).subscribe(lastActive => active = lastActive);

        return active;
      },

      setLinkAppMode: (appMode: boolean) => {
        self.store.dispatch(SettingsActions.setLinkAppMode({ appMode }));

        if (this.layoutService.model.isBrowser) {
          localStorage.setItem('appMode', JSON.stringify(appMode));
        };

        self.mediaService.model.appMode$.next(appMode);
      },
      presetTheme: (theme: ThemeType) => {
        self.store.dispatch(SettingsActions.presetTheme({ theme }));
      },
      initLocalStorage: () => {
        const storedAppMode = this.business.isLinkAppMode();

        if (localStorage) {
          try {
            const localAppMode = localStorage.getItem('appMode');

            if (localAppMode) {
              const appMode: boolean | null = JSON.parse(localAppMode);

              if (appMode !== null) {
                this.business.setLinkAppMode(appMode);
              } else {
                self.mediaService.model.appMode$.next(storedAppMode);
              }
            } else {
              self.mediaService.model.appMode$.next(storedAppMode);
            }
          } catch (ex) {
              self.mediaService.model.appMode$.next(storedAppMode);
          }
        } else {
          self.mediaService.model.appMode$.next(storedAppMode);
        }
      },
      setTheme: (theme: ThemeType) => {
        self.store.dispatch(SettingsActions.setTheme({ theme }));
      }
    }
  }
}
