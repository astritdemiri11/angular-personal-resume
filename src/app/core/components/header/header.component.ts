import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { MenuService } from 'src/app/modules/helpers/services/menu/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() menuClick: EventEmitter<void>;
  @Output() settingsClick: EventEmitter<void>;

  settingsOpened: boolean;

  constructor(
    public layoutService: LayoutService,
    public menuService: MenuService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router) {
    this.menuClick = new EventEmitter<void>();
    this.settingsClick = new EventEmitter<void>();
    this.settingsOpened = false;
  }

  onLogoClick(event: MouseEvent) {
    if (!this.layoutService.model.isBrowser) {
      return;
    }

    const path = this.router.url.split('?')[0].split('#')[0];

    if (path !== '/') {
      this.router.navigate(['/'], { queryParamsHandling: 'merge', preserveFragment: true });
    } else if (this.document.defaultView) {
      this.document.defaultView.location.reload();
    }

    event.preventDefault();
  }

  onMenuClick() {
    this.menuClick.emit();
  }

  onSettingsClick() {
    this.settingsClick.emit();
    this.settingsOpened = !this.settingsOpened;
  }
}
