import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Resolve } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { KeyValue, TranslateService } from 'ngx-material-translate';
import { filter, firstValueFrom, switchMap, take } from 'rxjs';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.interface';

import { REQUEST_URL } from '../../../constants/url.constant';
import { ResponseType } from '../../../models/response/response.enum';
import { BlogService } from '../../../services/blog/blog.service';

@Injectable({
  providedIn: 'root'
})
export class BlogResolver implements Resolve<(Blog | null)[]> {
  constructor(
    private transferState: TransferState,
    private layoutService: LayoutService,
    private translateService: TranslateService,
    private blogService: BlogService) { }

  async resolve(): Promise<(Blog | null)[]> {
    const blogTranslations = this.transferState.get<KeyValue<string | KeyValue<string>> | null>(makeStateKey('blog.translations'), null);

    if (blogTranslations) {
      this.translateService.business.addTranslations(blogTranslations, 'blog');
    } else {
      this.translateService.business.loadTranslations('blog');

      if (!this.layoutService.model.isBrowser) {
        const translationsLoaded$ = this.translateService.model.status('blog').pipe(
          filter(status => status === ResponseType.Success),
          take(1));

        await firstValueFrom(translationsLoaded$);

        this.translateService.model.languageTranslations('blog').pipe(take(1)).subscribe(blogTranslations => {
          if (blogTranslations) {
            this.transferState.set<KeyValue<string | KeyValue<string>>>(makeStateKey('blog.translations'), blogTranslations);
          }
        });
      }
    }

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json

    this.blogService.business.loadBlogs(`${serverUrl}/${feature.blog.load}`);

    return new Promise<(Blog | null)[]>((resolve) => {
      this.blogService.model.status().pipe(
        filter(status => status === ResponseType.Success),
        take(1),
        switchMap(() => this.blogService.model.blogs())).subscribe(blogs => resolve(blogs));
    });
  }
}
