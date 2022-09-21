import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { CarouselConfig } from 'ngx-scroll-carousel';
import { filter, Subscription, take } from 'rxjs';
import { Menu } from 'src/app/modules/helpers/models/menu/menu.interface';
import { PortfolioItem as Project } from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';
import { MenuService } from 'src/app/modules/helpers/services/menu/menu.service';

import { REQUEST_URL } from '../../constants/url.constant';
import { ResponseType } from '../../models/response/response.enum';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-node-project',
  templateUrl: './node-project.component.html',
  styleUrls: ['./node-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodeProjectComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenavProject?: MatSidenav;
  projects: Project[];
  carouselConfigs: CarouselConfig;
  selectedProjectName: string;
  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    private activateRoute: ActivatedRoute,
    private languageService: LanguageService,
    private menuService: MenuService,
    private projectService: ProjectService) {
    this.subscriptions = [];
    this.projects = [];
    this.selectedProjectName = '';
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
      { routerLink: '/', feature: 'node-project', fragment: 'intro', translation: 'menu.home' },
      { routerLink: '/blog', feature: 'node-project', fragment: 'intro', translation: 'menu.blog' },
      { routerLink: '/ng-library', feature: 'node-project', fragment: 'intro', translation: 'menu.ng-library' },
    ];

    this.menuService.model.headerMenus$.next(menus);

    this.carouselConfigs = {
      items: 3,
      controlsActiveClass: 'theme-accent_background',
      controlsButtonClass: 'theme-primary_background_300',
      controlsOverClass: 'theme-accent_background_200',
      navigationIconClass: 'theme-accent_color',
      navigation: false,
      navigationWrapperClasses: ['project-carousel-navigation', 'theme-primary_background_300'],
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
        this.selectedProjectName = param['project'];

        if (this.sidenavProject) {
          this.sidenavProject.close();
        }

        if (this.document.defaultView) {
          this.document.defaultView.scrollTo({ top: 0 });
        }
      }));
    }

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.projectService.business.loadProjects(`${serverUrl}/${feature.project.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.projectService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.projects = this.projectService.business.getProjects();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.projectService.business.translateProjects(`${serverUrl}/${feature.project.translate}`);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
