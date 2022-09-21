import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { catchError, map, switchMap } from 'rxjs';
import { CustomError } from 'src/app/shared/models/custom-error/custom-error.interface';

import { ProductTranslation } from '../../models/product/product.model';
import { ProductService } from '../../services/product/product.service';
import * as ProductActions from './product.actions';
import * as fromProductReducer from './product.reducer';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.loadProducts),
    switchMap(action => {
      return this.productService.request.loadProducts(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ProductActions.loadProductsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const products = this.productService.business.convertDTOs(response.data);
      return ProductActions.loadProductsSuccess({ languageCode: response.append.languageCode, products });
    })
  ));

  translateProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.translateProducts),
    switchMap(action => {
      return this.productService.request.translateProducts(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(ProductActions.translateProductsFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const products = this.productService.business.convertDTOs(response.data);
      const translations: UpdateNum<ProductTranslation>[] = products.map(product => ({
        id: product.id, changes: {
          translations: {
            [response.append.languageCode]: {
              description: product.description,
              title: product.title
            }
          }
        }
      }));

      return ProductActions.translateProductsSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));

  constructor(private actions$: Actions, private store: Store<fromProductReducer.State>, private productService: ProductService) {}
}
