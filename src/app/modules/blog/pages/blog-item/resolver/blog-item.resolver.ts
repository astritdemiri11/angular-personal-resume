import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LanguageService } from 'ngx-material-translate';
import { filter, switchMap, take } from 'rxjs';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.interface';

import { REQUEST_URL } from '../../../constants/url.constant';
import { ResponseType } from '../../../models/response/response.enum';
import { BlogService } from '../../../services/blog/blog.service';

@Injectable({
  providedIn: 'root'
})
export class BlogItemResolver implements Resolve<Blog | null> {
  constructor(
    private languageService: LanguageService,
    private blogService: BlogService) { }

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Blog | null> {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.html

    const blogName = route.paramMap.get('blog');

    if(!blogName) {
      throw new Error('[blog-item Resolver] route param is not defined');
    }

    this.blogService.business.loadBlogContent(`${serverUrl}/${feature.blog}`, blogName);

    const languageCode = this.languageService.business.getActiveLanguageCode();

    return new Promise<Blog | null>((resolve) => {
      this.blogService.model.state$.pipe(
        filter(state => state.status[languageCode] === ResponseType.ContentSuccess),
        take(1),
        switchMap(() => this.blogService.model.blogByName(blogName))).subscribe(blog => resolve(blog));
    });
  }
}
