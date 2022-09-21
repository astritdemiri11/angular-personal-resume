import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Resolve } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { KeyValue, ResponseType, TranslateService } from 'ngx-material-translate';
import { filter, firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescriptionResolver implements Resolve<boolean> {
  constructor(
    private transferState: TransferState,
    private layoutService: LayoutService,
    private translateService: TranslateService) { }

  async resolve(): Promise<boolean> {
    const descriptionTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey('description.translations'), null);

    if (descriptionTranslations) {
      this.translateService.business.addTranslations(descriptionTranslations, 'description');
    } else {
      this.translateService.business.loadTranslations('description');

      if (!this.layoutService.model.isBrowser) {
        const translationsLoaded$ = this.translateService.model.status('description').pipe(
          filter(status => status === ResponseType.Success),
          take(1));

        await firstValueFrom(translationsLoaded$);

        this.translateService.model.languageTranslations('description').pipe(take(1)).subscribe(descriptionTranslations => {
          if (descriptionTranslations) {
            this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey('description.translations'), descriptionTranslations);
          }
        });
      }
    }

    return new Promise<boolean>((resolve) => {
      resolve(true)
    });
  }
}
