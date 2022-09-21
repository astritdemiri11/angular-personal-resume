import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/core/services/settings/settings.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent {
  appMode: boolean | null;

  private subscriptions: Subscription[];

  constructor(private settingsService: SettingsService) {
    this.appMode = null;
    this.subscriptions = [];
  }

  onSetLinkMode(matRadioChange: MatRadioChange) {
    this.settingsService.business.setLinkAppMode(JSON.parse(matRadioChange.value));
  }

  ngOnInit() {
    this.subscriptions.push(this.settingsService.model.appMode$.subscribe(appMode => this.appMode = appMode));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
