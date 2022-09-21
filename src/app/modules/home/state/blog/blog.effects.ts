import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs';
import { BlogTranslation } from 'src/app/modules/helpers/models/blog/blog.interface';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { BlogService } from '../../services/blog/blog.service';
import * as BlogActions from './blog.actions';
import * as fromBlogReducer from './blog.reducer';

@Injectable()
export class BlogEffects {
  loadBlogs$ = createEffect(() => this.actions$.pipe(
    ofType(BlogActions.loadBlogs),
    switchMap(action => {
      return this.blogService.request.loadBlogs(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(BlogActions.loadBlogsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const blogs = this.blogService.business.convertDTOs(response.data);
      return BlogActions.loadBlogsSuccess({ languageCode: response.append.languageCode, blogs });
    })
  ));

  translateBlogs$ = createEffect(() => this.actions$.pipe(
    ofType(BlogActions.translateBlogs),
    switchMap(action => {
      return this.blogService.request.translateBlogs(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(BlogActions.translateBlogsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const blogs = this.blogService.business.convertDTOs(response.data);
      const translations: UpdateNum<BlogTranslation>[] = blogs.map(blog => ({
        id: blog.id, changes: {
          translations: {
            [response.append.languageCode]: blog.description
          }
        }
      }));

      return BlogActions.translateBlogsSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));

  constructor(private actions$: Actions, private store: Store<fromBlogReducer.State>, private blogService: BlogService) { }
}
