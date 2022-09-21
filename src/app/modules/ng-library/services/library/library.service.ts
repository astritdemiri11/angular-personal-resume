import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { PortfolioItem as Library } from 'src/app/modules/helpers/models/portfolio/portfolio-item.model';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import {
  PortfolioItem as LibraryInterface,
  PortfolioItemDTO as LibraryDTO,
} from '../../../helpers/models/portfolio/portfolio-item.interface';
import * as LibraryActions from '../../state/library/library.actions';
import * as fromLibraryReducer from '../../state/library/library.reducer';
import * as LibrarySelectors from '../../state/library/library.selectors';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromLibraryReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(LibrarySelectors.selectLibraryState),
      libraries: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(LibrarySelectors.selectLibraries(languageCode))
      },
      lastLibraries: () => {
        const languageCode = this.languageService.business.getLastActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(LibrarySelectors.selectLibraries(languageCode))
      },
      libraryByName: (name: string) => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(LibrarySelectors.selectLibraryByName(name, languageCode))
      },
      status: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(LibrarySelectors.selectStatus(languageCode))
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTOs: (libraryDTOs: LibraryDTO[]) => {
        return libraryDTOs.map(libraryDTO => new Library(libraryDTO));
      },
      loadLibraries: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load libraries without setting a default language!')
          }

          self.store.dispatch(LibraryActions.loadLibraries({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      loadLibraryContent: (path: string, name: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          const library = this.business.getLibraryByName(name);

          if (!force && (library && library.content)) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load library content without setting a default language!')
          }

          self.store.dispatch(LibraryActions.loadLibraryContent({ path: `${path}/${name}/${languageCode}.html`, name, languageCode }));
        });
      },
      getLibraryByName: (name: string): LibraryInterface | null => {
        let library: LibraryInterface | null = null;

        self.model.libraryByName(name).pipe(take(1)).subscribe(stateLibrary => library = stateLibrary)

        return library;
      },
      getLibraries: (): LibraryInterface[] => {
        let libraries: LibraryInterface[] = [];

        this.model.libraries().pipe(take(1)).subscribe(stateLibraries => {
          if (!stateLibraries.filter(library => library === null).length) {
            stateLibraries.forEach(library => {
              if (library) {
                libraries.push(library)
              }
            });
          }
        });

        if (!libraries.length) {
          this.model.lastLibraries().pipe(take(1)).subscribe(stateLibraries => {
            stateLibraries.forEach(library => {
              if (library) {
                libraries.push(library)
              }
            });
          });
        }

        return libraries;
      },
      translateLibraries: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if (status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot translate libraries without setting a default language!')
          }

          self.store.dispatch(LibraryActions.translateLibraries({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadLibraries: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<LibraryDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      },
      loadLibraryContent: (path: string, name: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<string, { name: string, languageCode: LanguageCode }>(path, { responseType: 'text' }, { name, languageCode });
      },
      translateLibraries: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<LibraryDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      }
    }
  }
}
