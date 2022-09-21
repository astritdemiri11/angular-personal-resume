import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/modules/helpers/models/menu/menu.interface';
import { MenuService } from 'src/app/modules/helpers/services/menu/menu.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  @ViewChildren('fragmentElem', { read: ElementRef }) fragmentElem?: QueryList<ElementRef<HTMLElement>>;

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    private menuService: MenuService
  ) {
    this.subscriptions = [];
  }

  ngOnInit() {
    const menus: Menu[] = [
      { routerLink: '/', feature: 'description', fragment: 'intro', translation: 'menu.home' },
      { routerLink: '/blog', feature: 'description', fragment: 'intro', translation: 'menu.blog' },
      { routerLink: '/ng-library', feature: 'description', fragment: 'intro', translation: 'menu.ng-library' },
      { routerLink: '/node-project', feature: 'description', fragment: 'intro', translation: 'menu.node-project' },
    ];

    this.menuService.model.headerMenus$.next(menus);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
