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

import { BlogRoutingModule } from './blog-routing.module';
import { BlogCarouselItemComponent } from './components/blog-carousel-item/blog-carousel-item.component';
import { BlogIndexComponent } from './pages/blog-index/blog-index.component';
import { BlogItemComponent } from './pages/blog-item/blog-item.component';
import { BlogComponent } from './pages/blog/blog.component';
import { featureKey, reducers } from './state';
import { BlogEffects } from './state/blog/blog.effects';

const materialModules = [
  FlexLayoutModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule
];

@NgModule({
  declarations: [
    BlogComponent,
    BlogItemComponent,
    BlogCarouselItemComponent,
    BlogIndexComponent
  ],
  imports: [
    BlogRoutingModule,
    EffectsModule.forFeature([BlogEffects]),
    materialModules,
    MaterialTranslateModule.forChild({
      defaultLanguage: LanguageCode.English,
      loader: { provide: TranslationLoaderService, useFactory: (http: HttpClient) => new TranslationLoaderService(http), deps: [HttpClient], multi: true },
      translationLoadingClass: 'blurOut',
      translationSuccessClass: 'blurIn'
    }),
    ScrollCarouselModule,
    SharedModule,
    StoreModule.forFeature(featureKey, reducers)
  ]
})
export class BlogModule { }
