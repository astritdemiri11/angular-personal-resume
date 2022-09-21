import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService, ResponseType } from 'ngx-material-translate';
import { filter, Subscription, take, timer } from 'rxjs';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { Profile } from '../../../models/profile/profile.interface';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() @Required('app-info') profile?: Profile | null;

  isLoading: boolean;
  isLoaded: boolean;

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    public profileService: ProfileService,
    private languageService: LanguageService) {
    this.subscriptions = [];

    this.isLoading = false;
    this.isLoaded = false;
  }

  ngOnInit() {
    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      const firstLoad = languageCode === lastActiveLanguageCode;

      if (!firstLoad) {
        this.isLoading = true;
        this.isLoaded = false;

        this.profileService.model.status().pipe(
          filter(status => status === ResponseType.Success), take(1)
        ).subscribe(() => {
          timer(0).subscribe(() => {
            this.isLoading = false;
            this.isLoaded = true;
          });
        });
      }
    }));
  }
}
