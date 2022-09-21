import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Resolve } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { KeyValue, TranslateService } from 'ngx-material-translate';
import { filter, firstValueFrom, switchMap, take } from 'rxjs';
import { PortfolioItem as Library } from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { REQUEST_URL } from '../../../constants/url.constant';
import { LibraryService } from '../../../services/library/library.service';

@Injectable({
  providedIn: 'root'
})
export class NgLibraryResolver implements Resolve<(Library | null)[]> {
  constructor(
    private transferState: TransferState,
    private layoutService: LayoutService,
    private translateService: TranslateService,
    private libraryService: LibraryService) { }

  async resolve(): Promise<(Library | null)[]> {
    const ngLibraryTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey('ng-library.translations'), null);

    if (ngLibraryTranslations) {
      this.translateService.business.addTranslations(ngLibraryTranslations, 'ng-library');
    } else {
      this.translateService.business.loadTranslations('ng-library');

      if (!this.layoutService.model.isBrowser) {
        const translationsLoaded$ = this.translateService.model.status('ng-library').pipe(
          filter(status => status === ResponseType.Success),
          take(1));

        await firstValueFrom(translationsLoaded$);

        this.translateService.model.languageTranslations('ng-library').pipe(take(1)).subscribe(ngLibraryTranslations => {
          if (ngLibraryTranslations) {
            this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey('ng-library.translations'), ngLibraryTranslations);
          }
        });
      }
    }

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json

    this.libraryService.business.loadLibraries(`${serverUrl}/${feature.library.load}`);

    return new Promise<(Library | null)[]>((resolve) => {
      this.libraryService.model.status().pipe(
        filter(status => status === ResponseType.Success),
        take(1),
        switchMap(() => this.libraryService.model.libraries())).subscribe(libraries => resolve(libraries));
    });
  }
}
