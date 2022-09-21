import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LanguageService } from 'ngx-material-translate';
import { filter, Observable, switchMap, take } from 'rxjs';
import { PortfolioItem as Project } from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';

import { REQUEST_URL } from '../../../constants/url.constant';
import { ResponseType } from '../../../models/response/response.enum';
import { ProjectService } from '../../../services/project/project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectItemResolver implements Resolve<Project | null> {
  constructor(
    private languageService: LanguageService,
    private projectService: ProjectService) { }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Project | null> {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.html

    const projectName = route.paramMap.get('project');

    if(!projectName) {
      throw new Error('[project-item Resolver] route param is not defined');
    }

    this.projectService.business.loadProjectContent(`${serverUrl}/${feature.project}`, projectName);

    const languageCode = this.languageService.business.getActiveLanguageCode();

    return this.projectService.model.state$.pipe(
      filter(state => state.status[languageCode] === ResponseType.ContentSuccess),
      take(1),
      switchMap(() => this.projectService.model.projectByName(projectName)));
  }
}
