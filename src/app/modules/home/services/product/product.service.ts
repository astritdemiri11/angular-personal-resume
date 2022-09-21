import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageCode, LanguageService, TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Product as ProductInterface, ProductDTO } from '../../models/product/product.interface';
import { Product } from '../../models/product/product.model';
import * as ProductActions from '../../state/product/product.actions';
import * as fromProductReducer from '../../state/product/product.reducer';
import * as ProductSelectors from '../../state/product/product.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromProductReducer.State>,
    private languageService: LanguageService,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(ProductSelectors.selectProductState),
      products: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProductSelectors.selectProducts(languageCode))
      },
      lastProducts: () => {
        const languageCode = this.languageService.business.getLastActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProductSelectors.selectProducts(languageCode))
      },
      status: () => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(ProductSelectors.selectStatus(languageCode))
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTOs: (productDTOs: ProductDTO[]) => {
        return productDTOs.map(productDTO => new Product(productDTO));
      },
      loadProducts: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if(status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load products without setting a default language!')
          }

          self.store.dispatch(ProductActions.loadProducts({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      getProducts: (): ProductInterface[] => {
        let products: ProductInterface[] = [];

        this.model.products().pipe(take(1)).subscribe(stateProducts => {
          if(!stateProducts.filter(product => product === null).length) {
            stateProducts.forEach(product => {
              if(product) {
                products.push(product)
              }
            });
          }
        });

        if (!products.length) {
          this.model.lastProducts().pipe(take(1)).subscribe(stateProducts => {
            stateProducts.forEach(product => {
              if(product) {
                products.push(product)
              }
            });
          });
        }

        return products;
      },
      translateProducts: (path: string, force: boolean = false) => {
        self.model.status().pipe(take(1)).subscribe(status => {
          if(status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          const languageCode = this.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot translate products without setting a default language!')
          }

          self.store.dispatch(ProductActions.translateProducts({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadProducts: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ProductDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      },
      translateProducts: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<ProductDTO[], { languageCode: LanguageCode }>(path, {}, { languageCode });
      }
    }
  }
}
