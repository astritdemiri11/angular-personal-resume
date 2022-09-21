import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LanguageService } from 'ngx-material-translate';
import { filter, Observable, switchMap, take } from 'rxjs';
import { PortfolioItem as Library } from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';

import { REQUEST_URL } from '../../../constants/url.constant';
import { ResponseType } from '../../../models/response/response.enum';
import { LibraryService } from '../../../services/library/library.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryItemResolver implements Resolve<Library | null> {
  constructor(
    private languageService: LanguageService,
    private libraryService: LibraryService) { }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Library | null> {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.html

    const libraryName = route.paramMap.get('library');

    if(!libraryName) {
      throw new Error('[library-item Resolver] route param is not defined');
    }

    this.libraryService.business.loadLibraryContent(`${serverUrl}/${feature.library}`, libraryName);

    const languageCode = this.languageService.business.getActiveLanguageCode();

    return this.libraryService.model.state$.pipe(
      filter(state => state.status[languageCode] === ResponseType.ContentSuccess),
      take(1),
      switchMap(() => this.libraryService.model.libraryByName(libraryName)));
  }
}
