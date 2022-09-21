import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LanguageCode, MaterialTranslateModule, TranslationLoaderService } from 'ngx-material-translate';
import { ScrollCarouselModule } from 'ngx-scroll-carousel';
import { SharedModule } from 'src/app/shared/shared.module';

import { LibraryCarouselItemComponent } from './components/library-carousel-item/library-carousel-item.component';
import { NgLibraryRoutingModule } from './ng-library-routing.module';
import { LibraryIndexComponent } from './pages/library-index/library-index.component';
import { LibraryItemComponent } from './pages/library-item/library-item.component';
import { NgLibraryComponent } from './pages/ng-library/ng-library.component';
import { featureKey, reducers } from './state';
import { LibraryEffects } from './state/library/library.effects';

const materialModules = [
  FlexLayoutModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule
];

@NgModule({
  declarations: [
    LibraryCarouselItemComponent,
    LibraryItemComponent,
    NgLibraryComponent,
    LibraryIndexComponent
  ],
  imports: [
    EffectsModule.forFeature([LibraryEffects]),
    materialModules,
    MaterialTranslateModule.forChild({
      defaultLanguage: LanguageCode.English,
      loader: { provide: TranslationLoaderService, useFactory: (http: HttpClient) => new TranslationLoaderService(http), deps: [HttpClient], multi: true },
      translationLoadingClass: 'blurOut',
      translationSuccessClass: 'blurIn'
    }),
    NgLibraryRoutingModule,
    ScrollCarouselModule,
    SharedModule,
    StoreModule.forFeature(featureKey, reducers)
  ]
})
export class NgLibraryModule { }
