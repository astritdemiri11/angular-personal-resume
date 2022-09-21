import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeGerman from '@angular/common/locales/de';
import localeEnglish from '@angular/common/locales/en';
import localeItalian from '@angular/common/locales/it';
import localeAlbanian from '@angular/common/locales/sq';
import localeTurkish from '@angular/common/locales/tr';
import { Inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, makeStateKey, TransferState } from '@angular/platform-browser';
import { LanguageDTO } from 'dist/ngx-material-translate/lib/models/language/language.interface';
import { LayoutService } from 'ngx-arrangement';
import { INTERNAL_FEATURE, KeyValue, LanguageCode, LanguageService, TranslateService } from 'ngx-material-translate';

import { COPYRIGHT_SVG } from '../constants/copyright.constant';
import { LOGO_SVG } from '../constants/logo.constant';
import { ThemeType } from '../models/theme/theme.enum';
import { SettingsService } from '../services/settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializer {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private transferState: TransferState,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private layoutService: LayoutService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private settingsService: SettingsService
  ) {
    registerLocaleData(localeAlbanian, LanguageCode.Albanian);
    registerLocaleData(localeEnglish, LanguageCode.English);
    registerLocaleData(localeGerman, LanguageCode.German);
    registerLocaleData(localeItalian, LanguageCode.Italian);
    registerLocaleData(localeTurkish, LanguageCode.Turkish);
  }
  public initApp(): Promise<boolean> {
    const self = this;

    return new Promise(resolve => {
      if (this.layoutService.model.isBrowser && this.document.defaultView) {
        this.settingsService.business.initLocalStorage();

        const url = new URL(this.document.defaultView.location.href);

        let languageCode = url.searchParams.get('lng') as LanguageCode;

        if (languageCode && Object.values(LanguageCode).includes(languageCode)) {
          self.languageService.business.selectLanguage(languageCode);
        }

        const theme = 'theme-' + url.searchParams.get('theme') as ThemeType;

        if (theme && Object.values(ThemeType).includes(theme)) {
          self.settingsService.business.presetTheme(theme);
        }

        const languageDTOs = this.transferState.get<LanguageDTO[] | null>(makeStateKey('languages'), null);

        if (languageDTOs) {
          const languages = this.languageService.business.convertDTOs(languageDTOs);
          this.languageService.business.addLanguages(languages);
        } else {
          this.languageService.business.loadLanguages();
        }

        const internalTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey(`${INTERNAL_FEATURE}.translations`), null);

        if (internalTranslations) {
          this.translateService.business.addTranslations(internalTranslations, INTERNAL_FEATURE);
        } else {
          this.translateService.business.loadTranslations(INTERNAL_FEATURE);
        }

        const appTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey('app.translations'), null);

        if (appTranslations) {
          this.translateService.business.addTranslations(appTranslations, 'app');
        } else {
          this.translateService.business.loadTranslations('app');
        }

        const coreTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey('core.translations'), null);

        if (coreTranslations) {
          this.translateService.business.addTranslations(coreTranslations, 'core');
        } else {
          this.translateService.business.loadTranslations('core');
        }
      }

      this.matIconRegistry.addSvgIconLiteral('logo',
        this.domSanitizer.bypassSecurityTrustHtml(LOGO_SVG));

        this.matIconRegistry.addSvgIconLiteral('copyright',
        this.domSanitizer.bypassSecurityTrustHtml(COPYRIGHT_SVG));

      resolve(function () {
        return true;
      }());
    });
  }
}
