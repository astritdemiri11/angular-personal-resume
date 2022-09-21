import { LayoutModule } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ArrangementModule } from 'ngx-arrangement';
import { LanguageCode, MaterialTranslateModule, TranslationLoaderService } from 'ngx-material-translate';
import { ScrollCarouselModule } from 'ngx-scroll-carousel';
import { TextAnimationModule } from 'ngx-text-animation';
import { SharedModule } from 'src/app/shared/shared.module';

import { HelpersModule } from '../helpers/helpers.module';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { ProfileComponent } from './components/about-me/profile/profile.component';
import { BlogItemComponent } from './components/blog/blog-item/blog-item.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactFormComponent } from './components/contact-me/contact-form/contact-form.component';
import { ContactItemComponent } from './components/contact-me/contact-item/contact-item.component';
import { ContactMeComponent } from './components/contact-me/contact-me.component';
import { InfoComponent } from './components/intro/info/info.component';
import { IntroComponent } from './components/intro/intro.component';
import { ParticlesComponent } from './components/intro/particles/particles.component';
import { SocialMediaItemComponent } from './components/intro/social-media/social-media-item/social-media-item.component';
import { SocialMediaComponent } from './components/intro/social-media/social-media.component';
import { PortfolioItemComponent } from './components/portfolio/portfolio-item/portfolio-item.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { ServiceItemComponent } from './components/product/product-item/product-item.component';
import { ProductComponent } from './components/product/product.component';
import { ResumeDetailItemComponent } from './components/resume/resume-item/resume-detail-item/resume-detail-item.component';
import { ResumeItemComponent } from './components/resume/resume-item/resume-item.component';
import { ResumeComponent } from './components/resume/resume.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { SkillItemComponent } from './components/skill/skill-item/skill-item.component';
import { SkillComponent } from './components/skill/skill.component';
import { UserReviewItemComponent } from './components/user-review/user-review-item/user-review-item.component';
import { UserReviewComponent } from './components/user-review/user-review.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { featureKey, reducers } from './state';
import { BlogEffects } from './state/blog/blog.effects';
import { ContactEffects } from './state/contact/contact.effects';
import { PortfolioEffects } from './state/portfolio/portfolio.effects';
import { ProductEffects } from './state/product/product.effects';
import { ProfileEffects } from './state/profile/profile.effects';
import { ResumeEffects } from './state/resume/resume.effects';
import { SkillEffects } from './state/skill/skill.effects';
import { SocialMediaEffects } from './state/social-media/social-media.effects';
import { UserReviewEffects } from './state/user-review/user-review.effects';

const materialModules = [
  FlexLayoutModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
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
  ],
  imports: [
    ArrangementModule,
    EffectsModule.forFeature([
      BlogEffects,
      ContactEffects,
      PortfolioEffects,
      ProductEffects,
      ProfileEffects,
      ResumeEffects,
      SkillEffects,
      SocialMediaEffects,
      UserReviewEffects
    ]),
    HelpersModule,
    HomeRoutingModule,
    LayoutModule,
    materialModules,
    MaterialTranslateModule.forChild({
      defaultLanguage: LanguageCode.English,
      loader: { provide: TranslationLoaderService, useFactory: (http: HttpClient) => new TranslationLoaderService(http), deps: [HttpClient], multi: true },
      translationLoadingClass: 'blurOut',
      translationSuccessClass: 'blurIn'
    }),
    ReactiveFormsModule,
    ScrollCarouselModule,
    SharedModule,
    StoreModule.forFeature(featureKey, reducers),
    TextAnimationModule
  ]
})
export class HomeModule { }
