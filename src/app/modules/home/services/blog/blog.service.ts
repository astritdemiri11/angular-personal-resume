import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { Blog as BlogInterface, BlogDTO } from 'src/app/modules/helpers/models/blog/blog.interface';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.model';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import * as BlogActions from '../../state/blog/blog.actions';
import * as fromBlogReducer from '../../state/blog/blog.reducer';
import * as BlogSelectors from '../../state/blog/blog.selectors';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromBlogReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

    private getModel() {
      return {
        state$: this.store.select(BlogSelectors.selectBlogState),
        blogs: () => {
          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(BlogSelectors.selectBlogs(languageCode))
        },
        lastBlogs: () => {
          const languageCode = this.languageService.business.getLastActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(BlogSelectors.selectBlogs(languageCode))
        },
        status: () => {
          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('There is no active language');
          }

          return this.store.select(BlogSelectors.selectStatus(languageCode))
        }
      }
    }

    private getBusiness() {
      const self = this;

      return {
        convertDTOs: (blogDTOs: BlogDTO[]) => {
          return blogDTOs.map(blogDTO => new Blog(blogDTO));
        },
        loadBlogs: (path: string, force: boolean = false) => {
          self.model.status().pipe(take(1)).subscribe(status => {
            if(status === ResponseType.Loading) {
              return;
            }

            if (!force && status === ResponseType.Success) {
              return;
            }

            const languageCode = this.languageService.business.getActiveLanguageCode();

            if (!languageCode) {
              throw new Error('Cannot load blogs without setting a default language!')
            }

            self.store.dispatch(BlogActions.loadBlogs({ path: `${path}/${languageCode}.json`, languageCode }));
          });
        },
        getBlogs: (): BlogInterface[] => {
          let blogs: BlogInterface[] = [];

          this.model.blogs().pipe(take(1)).subscribe(stateBlogs => {
            if(!stateBlogs.filter(blog => blog === null).length) {
              stateBlogs.forEach(blog => {
                if(blog) {
                  blogs.push(blog)
                }
              });
            }
          });

          if (!blogs.length) {
            this.model.lastBlogs().pipe(take(1)).subscribe(stateBlogs => {
              stateBlogs.forEach(blog => {
                if(blog) {
                  blogs.push(blog)
                }
              });
            });
          }

          return blogs;
        },
        translateBlogs: (path: string, force: boolean = false) => {
          self.model.status().pipe(take(1)).subscribe(status => {
            if(status === ResponseType.Loading) {
              return;
            }

            if (!force && status === ResponseType.Success) {
              return;
            }

            const languageCode = this.languageService.business.getActiveLanguageCode();

            if (!languageCode) {
              throw new Error('Cannot translate blogs without setting a default language!')
            }

            self.store.dispatch(BlogActions.translateBlogs({ path: `${path}/${languageCode}.json`, languageCode }));
          });
        }
      }
    }

    private getRequest() {
      const self = this;

      return {
        loadBlogs: (path: string, languageCode: LanguageCode) => {
          return self.translationLoaderService.get<BlogDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
        },
        translateBlogs: (path: string, languageCode: LanguageCode) => {
          return self.translationLoaderService.get<BlogDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
        }
      }
    }
}
