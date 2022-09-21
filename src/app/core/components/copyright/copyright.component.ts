import { Component } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';

import { THEME_COLOR_MAP } from '../../constants/theme.constant';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent {
  now: Date;

  constructor(
    public layoutService: LayoutService,
    private settingsService: SettingsService) {
    this.now = new Date();
   }

   isDarkTheme() {
    const theme = this.settingsService.business.getActiveTheme();
    return THEME_COLOR_MAP[theme].dark;
  }
}
