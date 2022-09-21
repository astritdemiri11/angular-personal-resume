import { Component } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(public layoutService: LayoutService) { }
}
