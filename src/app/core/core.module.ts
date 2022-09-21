import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreModule } from '@ngrx/store';
import { ArrangementModule } from 'ngx-arrangement';
import { LanguageCode, MaterialTranslateModule, TranslationLoaderService } from 'ngx-material-translate';

import { AppRoutingModule } from '../app-routing.module';
import { HelpersModule } from '../modules/helpers/helpers.module';
import { BottomSettingsComponent } from './components/bottom-sheet/bottom-settings/bottom-settings.component';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { CopyrightComponent } from './components/copyright/copyright.component';
import { FooterMenuOutletComponent } from './components/footer/footer-menu-outlet/footer-menu-outlet.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderMenuOutletComponent } from './components/header/header-menu-outlet/header-menu-outlet.component';
import { HeaderComponent } from './components/header/header.component';
import { FullScreenComponent } from './components/settings/full-screen/full-screen.component';
import { SettingsHeaderComponent } from './components/settings/settings-header/settings-header.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SocialMediaComponent } from './components/settings/social-media/social-media.component';
import { ThemeComponent } from './components/settings/theme/theme.component';
import { AppInitializer } from './initializer/app.initializer';
import { featureKey, reducers } from './state';

export function initApp(appLoadService: AppInitializer) {
  return () => appLoadService.initApp();
}

const materialModules = [
  FlexLayoutModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatRadioModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    BottomSettingsComponent,
    BottomSheetComponent,
    CopyrightComponent,
    FooterComponent,
    FooterMenuOutletComponent,
    FullScreenComponent,
    HeaderComponent,
    HeaderMenuOutletComponent,
    SettingsComponent,
    SettingsHeaderComponent,
    SocialMediaComponent,
    ThemeComponent
  ],
  imports: [
    ArrangementModule,
    AppRoutingModule,
    CommonModule,
    HelpersModule,
    HttpClientModule,
    materialModules,
    MaterialTranslateModule.forRoot({
      defaultLanguage: LanguageCode.English,
      languagesTranslatePath: '/assets/i18n/material-translate/language/translate',
      loader: { provide: TranslationLoaderService, useFactory: (http: HttpClient) => new TranslationLoaderService(http), deps: [HttpClient] },
      translationLoadingClass: 'blurOut',
      translationSuccessClass: 'blurIn'
    }),
    StoreModule.forFeature(featureKey, reducers)
  ],
  exports: [
    BottomSheetComponent,
    CopyrightComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuOutletComponent,
    materialModules,
    SettingsComponent,
    SettingsHeaderComponent
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initApp, multi: true, deps: [AppInitializer] }
  ]
})
export class CoreModule { }
