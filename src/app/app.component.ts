import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { INTERNAL_FEATURE, LanguageService, TranslateService } from 'ngx-material-translate';
import { Subscription, timer } from 'rxjs';

import { THEME_COLOR_MAP } from './core/constants/theme.constant';
import { ThemeType } from './core/models/theme/theme.enum';
import { SettingsService } from './core/services/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  now: Date;

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    private meta: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayContainer: OverlayContainer,
    private renderer2: Renderer2,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private settingsService: SettingsService
  ) {
    this.now = new Date();
    this.subscriptions = [];
  }

  getSidenavRole() {
    return this.layoutService.business.isHandset() ? 'dialog' : 'navigation';
  }

  getSidenavMode(): MatDrawerMode {
    return this.layoutService.business.isHandset() ? 'over' : 'side';
  }

  isSidenavOpened() {
    // return !this.layoutService.business.isHandset();
    return false;
  }

  isDarkTheme() {
    const theme = this.settingsService.business.getActiveTheme();
    return THEME_COLOR_MAP[theme].dark;
  }

  onLogoClick(event: MouseEvent) {
    const path = this.router.url.split('?')[0].split('#')[0];

    if(path !== '/') {
      this.router.navigate(['/'], { queryParamsHandling: 'merge', preserveFragment: true });
    } else if (this.document.defaultView) {
      this.document.defaultView.location.reload();
    }

    event.preventDefault();
  }

  ngOnInit() {
    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { lng: languageCode },
          queryParamsHandling: 'merge',
          preserveFragment: false
        });

        this.translateService.business.loadTranslations(INTERNAL_FEATURE);
        this.translateService.business.loadTranslations('app');
        this.translateService.business.loadTranslations('core');
        this.languageService.business.translateLanguages();
      }
    }));

    this.subscriptions.push(this.settingsService.model.theme$.subscribe((theme: ThemeType) => {
      if (theme) {
        const overlayElement = this.overlayContainer.getContainerElement();
        const lastActiveTheme = this.settingsService.business.getLastActiveTheme();

        if (theme !== lastActiveTheme) {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { theme: theme.replace('theme-', '') },
            queryParamsHandling: 'merge'
          });

          this.renderer2.removeClass(this.document.documentElement, lastActiveTheme);
          this.renderer2.removeClass(overlayElement, lastActiveTheme);
        }

        this.renderer2.addClass(this.document.documentElement, 'theme-changing');

        this.renderer2.addClass(this.document.documentElement, theme);
        this.renderer2.addClass(overlayElement, theme);

        this.meta.updateTag({ name: 'theme-color', content: THEME_COLOR_MAP[theme].defaultColor }, "name='theme-color'");

        timer(300).subscribe(() => {
          this.renderer2.removeClass(this.document.documentElement, 'theme-changing');
        });
      }
    }));

    this.subscriptions.push(this.layoutService.model.handset$.subscribe(handset => {
      const overlayElement = this.overlayContainer.getContainerElement();

      if (handset) {
        this.renderer2.addClass(this.document.documentElement, 'handset');
        this.renderer2.addClass(overlayElement, 'handset');
      } else {
        this.renderer2.removeClass(this.document.documentElement, 'handset');
        this.renderer2.removeClass(overlayElement, 'handset');
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
