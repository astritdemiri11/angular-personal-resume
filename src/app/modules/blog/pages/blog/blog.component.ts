import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { CarouselConfig } from 'ngx-scroll-carousel';
import { filter, Subscription, take } from 'rxjs';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.interface';
import { Menu } from 'src/app/modules/helpers/models/menu/menu.interface';
import { MenuService } from 'src/app/modules/helpers/services/menu/menu.service';

import { REQUEST_URL } from '../../constants/url.constant';
import { ResponseType } from '../../models/response/response.enum';
import { BlogService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenavBlog?: MatSidenav;
  blogs: Blog[];
  carouselConfigs: CarouselConfig;
  selectedBlogName: string;
  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    private activateRoute: ActivatedRoute,
    private languageService: LanguageService,
    private menuService: MenuService,
    private blogService: BlogService) {
    this.subscriptions = [];
    this.blogs = [];
    this.selectedBlogName = '';
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
      { routerLink: '/', feature: 'blog', fragment: 'intro', translation: 'menu.home' },
      { routerLink: '/ng-library', feature: 'blog', fragment: 'intro', translation: 'menu.ng-library' },
      { routerLink: '/node-project', feature: 'blog', fragment: 'intro', translation: 'menu.node-project' },
    ];

    this.menuService.model.headerMenus$.next(menus);

    this.carouselConfigs = {
      items: 0,
      controlsActiveClass: 'theme-accent_background',
      controlsButtonClass: 'theme-primary_background_300',
      controlsOverClass: 'theme-accent_background_200',
      navigationIconClass: 'theme-accent_color',
      navigation: false,
      navigationWrapperClasses: ['blog-carousel-navigation', 'theme-primary_background_300'],
      speed: 3000
    };

    this.subscriptions.push(this.layoutService.model.handset$.subscribe(handset => {
      this.carouselConfigs = {
        ...this.carouselConfigs,
        controls: !handset,
        items: handset ? 2 : 3,
        mobileGestures: handset,
        navigation: handset,
        navigationOutset: handset,
        verticalVersion: handset
      };
    }));

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.blogService.business.loadBlogs(`${serverUrl}/${feature.blog.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.blogService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.blogs = this.blogService.business.getBlogs();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        // this.translateService.business.loadTranslations('blog');
        this.blogService.business.translateBlogs(`${serverUrl}/${feature.blog.translate}`);
      }
    }));

    if (!this.layoutService.model.isBrowser) {
      return;
    }

    if (this.activateRoute.firstChild) {
      this.subscriptions.push(this.activateRoute.firstChild.params.subscribe(param => {
        this.selectedBlogName = param['blog'];

        if(this.sidenavBlog) {
          this.sidenavBlog.close();
        }

        if(this.document.defaultView) {
          this.document.defaultView.scrollTo({ top: 0 });
        }
      }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
