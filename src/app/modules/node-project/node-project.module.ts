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

import { ProjectCarouselItemComponent } from './components/project-carousel-item/project-carousel-item.component';
import { NodeProjectRoutingModule } from './node-project-routing.module';
import { NodeProjectComponent } from './pages/node-project/node-project.component';
import { ProjectIndexComponent } from './pages/project-index/project-index.component';
import { ProjectItemComponent } from './pages/project-item/project-item.component';
import { featureKey, reducers } from './state';
import { ProjectEffects } from './state/project/project.effects';

const materialModules = [
  FlexLayoutModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule
];

@NgModule({
  declarations: [
    NodeProjectComponent,
    ProjectCarouselItemComponent,
    ProjectItemComponent,
    ProjectIndexComponent
  ],
  imports: [
    EffectsModule.forFeature([ProjectEffects]),
    materialModules,
    MaterialTranslateModule.forChild({
      defaultLanguage: LanguageCode.English,
      loader: { provide: TranslationLoaderService, useFactory: (http: HttpClient) => new TranslationLoaderService(http), deps: [HttpClient], multi: true },
      translationLoadingClass: 'blurOut',
      translationSuccessClass: 'blurIn'
    }),
    NodeProjectRoutingModule,
    ScrollCarouselModule,
    SharedModule,
    StoreModule.forFeature(featureKey, reducers)
  ]
})
export class NodeProjectModule { }
