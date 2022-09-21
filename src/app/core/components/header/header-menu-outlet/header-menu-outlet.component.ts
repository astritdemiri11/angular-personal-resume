import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { Subscription, take, timer } from 'rxjs';
import { Menu } from 'src/app/modules/helpers/models/menu/menu.interface';
import { MenuService } from 'src/app/modules/helpers/services/menu/menu.service';

@Component({
  selector: 'app-header-menu-outlet',
  templateUrl: './header-menu-outlet.component.html',
  styleUrls: ['./header-menu-outlet.component.scss']
})
export class HeaderMenuOutletComponent implements OnInit, OnDestroy {
  @Output() menuClick: EventEmitter<string>;

  menus: Menu[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    public menuService: MenuService,
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute) {
    this.menuClick = new EventEmitter<string>();
    this.menus = [];
    this.subscriptions = [];
  }

  onMenuClick(fragment: string) {
    if (!this.layoutService.model.isBrowser) {
      return;
    }

    this.activatedRoute.fragment.pipe(take(1)).subscribe(currentFragment => {
      if (currentFragment === fragment) {
        const element = this.menuService.model.fragmentElem[fragment];

        if (this.document.defaultView && element) {
          const elementTop = element.nativeElement.getBoundingClientRect().top;

          this.document.defaultView.scroll({
            top: this.document.defaultView.scrollY + elementTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });

    this.menuClick.emit(fragment);
  }

  isActive(fragment: string) {
    if (this.layoutService.model.isBrowser) {
      const element = this.menuService.model.fragmentElem[fragment];

      if (this.document.defaultView && element) {
        const elementBounding = element.nativeElement.getBoundingClientRect();

        if (elementBounding.top <= this.document.defaultView.innerHeight / 2 &&
          elementBounding.bottom > this.document.defaultView.innerHeight / 2) {
          return true;
        }
      }
    }

    return false;
  }

  ngOnInit() {
    this.subscriptions.push(this.menuService.model.headerMenus$.subscribe((menus: Menu[]) => {
      timer(0).subscribe(() => this.menus = menus);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
