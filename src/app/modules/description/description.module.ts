import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ArrangementModule } from 'ngx-arrangement';
import { LanguageCode, MaterialTranslateModule, TranslationLoaderService } from 'ngx-material-translate';
import { SharedModule } from 'src/app/shared/shared.module';

import { DescriptionRoutingModule } from './description-routing.module';
import { DescriptionComponent } from './pages/description/description.component';

const materialModules = [
  FlexLayoutModule
];

@NgModule({
  declarations: [
    DescriptionComponent
  ],
  imports: [
    ArrangementModule,
    DescriptionRoutingModule,
    MaterialTranslateModule.forChild({
      defaultLanguage: LanguageCode.English,
      loader: { provide: TranslationLoaderService, useFactory: (http: HttpClient) => new TranslationLoaderService(http), deps: [HttpClient], multi: true },
      translationLoadingClass: 'blurOut',
      translationSuccessClass: 'blurIn'
    }),
    SharedModule,
    materialModules,
    SharedModule
  ]
})
export class DescriptionModule { }
