import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { LoadContentDirective, ServerSideDirective, ServerSideRenderDirective, VirtualLoadComponent } from 'ngx-arrangement';
import {
  LanguageComponent,
  mockState,
  TRANSLATE_CONFIG,
  TranslateDirective,
  TranslatePipe,
  TranslationLoaderService,
} from 'ngx-material-translate';
import { CarouselComponent, CarouselItemDirective } from 'ngx-scroll-carousel';
import { TextDisplayComponent, TextReadComponent, TextScrollDirective } from 'ngx-text-animation';
import { of } from 'rxjs';

import { FooterMenuOutletComponent } from '../core/components/footer/footer-menu-outlet/footer-menu-outlet.component';
import { FooterComponent } from '../core/components/footer/footer.component';
import { HeaderMenuOutletComponent } from '../core/components/header/header-menu-outlet/header-menu-outlet.component';
import { HeaderComponent } from '../core/components/header/header.component';
import { SettingsHeaderComponent } from '../core/components/settings/settings-header/settings-header.component';
import { SettingsComponent } from '../core/components/settings/settings.component';
import { ThemeComponent } from '../core/components/settings/theme/theme.component';
import { AboutMeComponent } from '../modules/home/components/about-me/about-me.component';
import { ProfileComponent } from '../modules/home/components/about-me/profile/profile.component';
import { BlogItemComponent } from '../modules/home/components/blog/blog-item/blog-item.component';
import { BlogComponent } from '../modules/home/components/blog/blog.component';
import { ContactFormComponent } from '../modules/home/components/contact-me/contact-form/contact-form.component';
import { ContactItemComponent } from '../modules/home/components/contact-me/contact-item/contact-item.component';
import { ContactMeComponent } from '../modules/home/components/contact-me/contact-me.component';
import { InfoComponent } from '../modules/home/components/intro/info/info.component';
import { IntroComponent } from '../modules/home/components/intro/intro.component';
import { ParticlesComponent } from '../modules/home/components/intro/particles/particles.component';
import {
  SocialMediaItemComponent,
} from '../modules/home/components/intro/social-media/social-media-item/social-media-item.component';
import { SocialMediaComponent } from '../modules/home/components/intro/social-media/social-media.component';
import { PortfolioItemComponent } from '../modules/home/components/portfolio/portfolio-item/portfolio-item.component';
import { PortfolioComponent } from '../modules/home/components/portfolio/portfolio.component';
import { ServiceItemComponent } from '../modules/home/components/product/product-item/product-item.component';
import { ProductComponent } from '../modules/home/components/product/product.component';
import {
  ResumeDetailItemComponent,
} from '../modules/home/components/resume/resume-item/resume-detail-item/resume-detail-item.component';
import { ResumeItemComponent } from '../modules/home/components/resume/resume-item/resume-item.component';
import { ResumeComponent } from '../modules/home/components/resume/resume.component';
import { SectionHeaderComponent } from '../modules/home/components/section-header/section-header.component';
import { SkillItemComponent } from '../modules/home/components/skill/skill-item/skill-item.component';
import { SkillComponent } from '../modules/home/components/skill/skill.component';
import { UserReviewItemComponent } from '../modules/home/components/user-review/user-review-item/user-review-item.component';
import { UserReviewComponent } from '../modules/home/components/user-review/user-review.component';
import { HomeComponent } from '../modules/home/pages/home/home.component';
import { DisplayModeDirective } from '../shared/directives/display-mode/display-mode.directive';
import { CustomDatePipe } from '../shared/pipes/custom-date/custom-date.pipe';

const testingProviders = [
  { provide: TRANSLATE_CONFIG, useValue: {} },
  { provide: TranslationLoaderService, useFactory: () => ({ get: () => of({}) }) },
  { provide: ActivatedRoute, useValue: { params: of({ id: 123 }) } },
  provideMockStore({
    initialState: mockState()
  })
]

const materialModules = [
  FlexLayoutModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule
];

const testingDeclarations = [
  VirtualLoadComponent,
  ServerSideDirective,
  ServerSideRenderDirective,
  LoadContentDirective,

  CarouselComponent,
  CarouselItemDirective,

  LanguageComponent,
  TranslatePipe,
  TranslateDirective,

  TextDisplayComponent,
  TextReadComponent,
  TextScrollDirective,

  CustomDatePipe,
  FooterComponent,
  HeaderComponent,
  SettingsComponent,
  SettingsHeaderComponent,
  ThemeComponent,

  DisplayModeDirective,

  FooterMenuOutletComponent,
  HeaderMenuOutletComponent,

  AboutMeComponent,
  ProfileComponent,
  BlogComponent,
  BlogItemComponent,
  ContactFormComponent,
  ContactItemComponent,
  ContactMeComponent,
  HomeComponent,
  InfoComponent,
  IntroComponent,
  ParticlesComponent,
  PortfolioComponent,
  PortfolioItemComponent,
  ResumeComponent,
  ResumeDetailItemComponent,
  ResumeItemComponent,
  SectionHeaderComponent,
  ServiceItemComponent,
  ProductComponent,
  SkillComponent,
  SkillItemComponent,
  SocialMediaComponent,
  SocialMediaItemComponent,
  UserReviewComponent,
  UserReviewItemComponent
]

const testingModules = [
  BrowserAnimationsModule,
  materialModules,
  HttpClientTestingModule
]

export const TESTING_DECLARATIONS = [...testingDeclarations];
export const TESTING_MODULES = [...testingModules];
export const TESTING_PROVIDERS = [...testingProviders];
