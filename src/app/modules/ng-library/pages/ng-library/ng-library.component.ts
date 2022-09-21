import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { CarouselConfig } from 'ngx-scroll-carousel';
import { filter, Subscription, take } from 'rxjs';
import { Menu } from 'src/app/modules/helpers/models/menu/menu.interface';
import { PortfolioItem as Library } from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';
import { MenuService } from 'src/app/modules/helpers/services/menu/menu.service';

import { REQUEST_URL } from '../../constants/url.constant';
import { ResponseType } from '../../models/response/response.enum';
import { LibraryService } from '../../services/library/library.service';

@Component({
  selector: 'app-ng-library',
  templateUrl: './ng-library.component.html',
  styleUrls: ['./ng-library.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgLibraryComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenavLibrary?: MatSidenav;
  libraries: Library[];
  carouselConfigs: CarouselConfig;
  selectedLibraryName: string;
  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    private activateRoute: ActivatedRoute,
    private languageService: LanguageService,
    private menuService: MenuService,
    private libraryService: LibraryService) {
    this.subscriptions = [];
    this.libraries = [];
    this.selectedLibraryName = '';
    this.carouselConfigs = { items: 0 };
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

  ngOnInit() {
    const menus: Menu[] = [
      { routerLink: '/', feature: 'ng-library', fragment: 'intro', translation: 'menu.home' },
      { routerLink: '/blog', feature: 'ng-library', fragment: 'intro', translation: 'menu.blog' },
      { routerLink: '/node-project', feature: 'ng-library', fragment: 'intro', translation: 'menu.node-project' },
    ];

    this.menuService.model.headerMenus$.next(menus);

    this.carouselConfigs = {
      items: 3,
      controlsActiveClass: 'theme-accent_background',
      controlsButtonClass: 'theme-primary_background_300',
      controlsOverClass: 'theme-accent_background_200',
      navigationIconClass: 'theme-accent_color',
      navigation: false,
      navigationWrapperClasses: ['library-carousel-navigation', 'theme-primary_background_300'],
      speed: 3000
    };

    this.subscriptions.push(this.layoutService.model.handset$.subscribe(handset => {
      this.carouselConfigs = {
        ...this.carouselConfigs,
        controls: !handset,
        mobileGestures: handset,
        navigation: handset,
        navigationOutset: handset,
        verticalVersion: handset
      };
    }));

    if (this.activateRoute.firstChild) {
      this.subscriptions.push(this.activateRoute.firstChild.params.subscribe(param => {
        this.selectedLibraryName = param['library'];

        if (this.sidenavLibrary) {
          this.sidenavLibrary.close();
        }

        if (this.document.defaultView) {
          this.document.defaultView.scrollTo({ top: 0 });
        }
      }));
    }

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.libraryService.business.loadLibraries(`${serverUrl}/${feature.library.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.libraryService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.libraries = this.libraryService.business.getLibraries();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.libraryService.business.translateLibraries(`${serverUrl}/${feature.library.translate}`);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
