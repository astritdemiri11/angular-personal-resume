import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  PortfolioItemTranslation as LibraryTranslation,
} from 'src/app/modules/helpers/models/portfolio/portfolio-item.model';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { LibraryService } from '../../services/library/library.service';
import * as LibraryActions from './library.actions';
import * as fromLibraryReducer from './library.reducer';

@Injectable()
export class LibraryEffects {
  loadLibraries$ = createEffect(() => this.actions$.pipe(
    ofType(LibraryActions.loadLibraries),
    switchMap(action => {
      return this.libraryService.request.loadLibraries(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(LibraryActions.loadLibrariesFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const items = this.libraryService.business.convertDTOs(response.data);
      return LibraryActions.loadLibrariesSuccess({ languageCode: response.append.languageCode, items });
    })
  ));

  loadLibraryContent$ = createEffect(() => this.actions$.pipe(
    ofType(LibraryActions.loadLibraryContent),
    switchMap(action => {
      return this.libraryService.request.loadLibraryContent(action.path, action.name, action.languageCode);
    }),
    catchError((error: CustomError<{ name: string, languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(LibraryActions.loadLibraryContentFailure({ name: error.append.name, languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      return LibraryActions.loadLibraryContentSuccess({ name: response.append.name, languageCode: response.append.languageCode, content: response.data });
    })
  ));

  translateLibraries$ = createEffect(() => this.actions$.pipe(
    ofType(LibraryActions.translateLibraries),
    switchMap(action => {
      return this.libraryService.request.translateLibraries(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(LibraryActions.translateLibrariesFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const libraries = this.libraryService.business.convertDTOs(response.data);
      const translations: UpdateNum<LibraryTranslation>[] = libraries.map(library => ({
        id: library.id, changes: {
          translations: {
            [response.append.languageCode]: {
              subtitle: library.subtitle,
              title: library.title
            }
          }
        }
      }));

      return LibraryActions.translateLibrariesSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));

  constructor(private actions$: Actions, private store: Store<fromLibraryReducer.State>, private libraryService: LibraryService) {}
}
