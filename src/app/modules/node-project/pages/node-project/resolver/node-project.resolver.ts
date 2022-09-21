import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Resolve } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { KeyValue, TranslateService } from 'ngx-material-translate';
import { filter, firstValueFrom, switchMap, take } from 'rxjs';
import { PortfolioItem as Project } from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';

import { REQUEST_URL } from '../../../constants/url.constant';
import { ResponseType } from '../../../models/response/response.enum';
import { ProjectService } from '../../../services/project/project.service';

@Injectable({
  providedIn: 'root'
})
export class NodeProjectResolver implements Resolve<(Project | null)[]> {
  constructor(
    private transferState: TransferState,
    private layoutService: LayoutService,
    private translateService: TranslateService,
    private projectService: ProjectService) { }

  async resolve(): Promise<(Project | null)[]> {
    const nodeProjectTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey('node-project.translations'), null);

    if (nodeProjectTranslations) {
      this.translateService.business.addTranslations(nodeProjectTranslations, 'node-project');
    } else {
      this.translateService.business.loadTranslations('node-project');

      if (!this.layoutService.model.isBrowser) {
        const translationsLoaded$ = this.translateService.model.status('node-project').pipe(
          filter(status => status === ResponseType.Success),
          take(1));

        await firstValueFrom(translationsLoaded$);

        this.translateService.model.languageTranslations('node-project').pipe(take(1)).subscribe(nodeProjectTranslations => {
          if (nodeProjectTranslations) {
            this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey('node-project.translations'), nodeProjectTranslations);
          }
        });
      }
    }

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json

    this.projectService.business.loadProjects(`${serverUrl}/${feature.project.load}`);

    return new Promise<(Project | null)[]>((resolve) => {
      this.projectService.model.status().pipe(
        filter(status => status === ResponseType.Success),
        take(1),
        switchMap(() => this.projectService.model.projects())).subscribe(libraries => resolve(libraries));
    });;
  }
}
