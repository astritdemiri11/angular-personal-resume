import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { Subscription } from 'rxjs';
import { ThemeType } from 'src/app/core/models/theme/theme.enum';
import { SettingsService } from 'src/app/core/services/settings/settings.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {
  selectedTheme: ThemeType;
  themes: ThemeType[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    private settingsService: SettingsService) {
    this.selectedTheme = ThemeType.Undefined;
    this.themes = Object.values(ThemeType).filter(theme => theme !== ThemeType.Undefined);
    this.subscriptions = [];
   }

   onThemeSet(theme: ThemeType) {
    this.settingsService.business.setTheme(theme);
   }

   calculateFlex() {
    let module = this.themes.length % 4;

    if(module === 0 || module === 3) {
      return 25
    }

    module = this.themes.length % 3;

    if(module === 0 || module === 2) {
      return 33.3333
    }

    return 50
   }

   ngOnInit() {
    this.subscriptions.push(this.settingsService.model.theme$.subscribe(theme => this.selectedTheme = theme));
   }

   ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
   }
}
