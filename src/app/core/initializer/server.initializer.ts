import { Inject, Injectable, Injector } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { readFileSync } from 'fs';
import { LayoutService } from 'ngx-arrangement';
import {
  INTERNAL_FEATURE,
  LanguageCode,
  LanguageService,
  TRANSLATE_CONFIG,
  TranslateConfigInterface,
  TranslateService,
} from 'ngx-material-translate';
import { join } from 'path';

@Injectable({ providedIn: 'root' })
export class ServerInitializer {
  constructor(
    @Inject(TRANSLATE_CONFIG) private translateConfig: TranslateConfigInterface,
    private injector: Injector,
    private transferState: TransferState,
    private layoutService: LayoutService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) { }
  public initApp(): Promise<boolean> {
    const self = this;

    return new Promise(resolve => {
      const isMobile = JSON.parse(this.injector.get('isMobile'));
      this.layoutService.business.setServerHandset(isMobile);

      const url = new URL(this.injector.get('url'));
      const languageCode = (url.searchParams.get('lng') as LanguageCode) || LanguageCode.English;

      if (languageCode && Object.values(LanguageCode).includes(languageCode)) {
        self.languageService.business.selectLanguage(languageCode);
      }

      const distFolder = join(process.cwd(), 'dist/personal-resume/browser');

      const languageData = readFileSync(`${distFolder}${this.translateConfig.languagesPath}/${languageCode}.json`, 'utf8');
      const languageDTOs = JSON.parse(languageData);

      this.transferState.set(makeStateKey('languages'), languageDTOs);

      const languages = this.languageService.business.convertDTOs(languageDTOs);
      this.languageService.business.addLanguages(languages);

      const internalData = readFileSync(`${distFolder}${this.translateConfig.path}/${INTERNAL_FEATURE}/${languageCode}.json`, 'utf8');
      const internalTranslations = JSON.parse(internalData);
      this.transferState.set(makeStateKey(`${INTERNAL_FEATURE}.translations`), internalTranslations);
      this.translateService.business.addTranslations(internalTranslations, INTERNAL_FEATURE);

      const appData = readFileSync(`${distFolder}${this.translateConfig.path}/app/${languageCode}.json`, 'utf8');
      const appTranslations = JSON.parse(appData);
      this.transferState.set(makeStateKey('app.translations'), appTranslations);
      this.translateService.business.addTranslations(appTranslations, 'app');

      const coreData = readFileSync(`${distFolder}${this.translateConfig.path}/core/${languageCode}.json`, 'utf8');
      const coreTranslations = JSON.parse(coreData);
      this.transferState.set(makeStateKey('core.translations'), coreTranslations);
      this.translateService.business.addTranslations(coreTranslations, 'core');

      resolve(function () {
        return true;
      }());
    });
  }
}

// import { Injectable, Injector } from '@angular/core';
// import { makeStateKey, TransferState } from '@angular/platform-browser';
// import {
//   INTERNAL_FEATURE,
//   KeyValue,
//   LanguageCode,
//   LanguageDTO,
//   LanguageService,
//   TranslateService,
// } from 'ngx-material-translate';
// import { filter, firstValueFrom, take } from 'rxjs';
// import { ResponseType } from 'src/app/shared/models/response/response.enum';

// @Injectable()
// export class ServerInitializer {
//   constructor(
//     private injector: Injector,
//     private transferState: TransferState,
//     private languageService: LanguageService,
//     private translateService: TranslateService
//   ) { }
//   public initApp(): Promise<boolean> {
//     const self = this;

//     return new Promise(async resolve => {
//       const url = new URL(this.injector.get('url'));

//       const languageCode = (url.searchParams.get('lng') as LanguageCode) || LanguageCode.English;

//       if (languageCode && Object.values(LanguageCode).includes(languageCode)) {
//         self.languageService.business.selectLanguage(languageCode);
//       }

//       this.languageService.business.loadLanguages();

//       const languagesLoaded$ = this.languageService.model.status$.pipe(
//         filter(status => status === ResponseType.Success),
//         take(1));

//       await firstValueFrom(languagesLoaded$);

//       this.languageService.model.languages$.pipe(take(1)).subscribe(languages => {
//         const languageDTOs: LanguageDTO[] = languages.map(language => ({
//           id: language.id,
//           n: language.name,
//           c: language.code,
//           f: language.flag
//         }));

//         this.transferState.set<LanguageDTO[]>(makeStateKey('languages'), languageDTOs);
//       });

//       this.translateService.business.loadTranslations(INTERNAL_FEATURE);

//       const internalTranslationsLoaded$ = this.translateService.model.status(INTERNAL_FEATURE).pipe(
//         filter(status => status === ResponseType.Success),
//         take(1));

//       await firstValueFrom(internalTranslationsLoaded$);

//       this.translateService.model.languageTranslations(INTERNAL_FEATURE).pipe(take(1)).subscribe(internalTranslations => {
//         if (internalTranslations) {
//           this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey(`${INTERNAL_FEATURE}.translations`), internalTranslations);
//         }
//       });

//       this.translateService.business.loadTranslations('app');

//       const appTranslationsLoaded$ = this.translateService.model.status('app').pipe(
//         filter(status => status === ResponseType.Success),
//         take(1));

//       await firstValueFrom(appTranslationsLoaded$);

//       this.translateService.model.languageTranslations('app').pipe(take(1)).subscribe(appTranslations => {
//         if (appTranslations) {
//           this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey('app.translations'), appTranslations);
//         }
//       });

//       this.translateService.business.loadTranslations('core');

//       const coreTranslationsLoaded$ = this.translateService.model.status('core').pipe(
//         filter(status => status === ResponseType.Success),
//         take(1));

//       await firstValueFrom(coreTranslationsLoaded$);

//       this.translateService.model.languageTranslations('core').pipe(take(1)).subscribe(coreTranslations => {
//         if (coreTranslations) {
//           this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey('core.translations'), coreTranslations);
//         }
//       });

//       resolve(function () {
//         return true;
//       }());
//     });
//   }
// }

