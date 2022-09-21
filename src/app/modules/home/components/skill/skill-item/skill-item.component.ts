import { Component, Input } from '@angular/core';
import { LanguageService, ResponseType } from 'ngx-material-translate';
import { filter, Subscription, take, timer } from 'rxjs';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { Skill } from '../../../models/skill/skill.interface';
import { SkillService } from '../../../services/skill/skill.service';

@Component({
  selector: 'app-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.scss']
})
export class SkillItemComponent {
  @Input() @Required('app-skill-item') item?: Skill;

  isLoading: boolean;
  isLoaded: boolean;

  private subscriptions: Subscription[];

  constructor(
    private languageService: LanguageService,
    private skillService: SkillService) {
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

        this.skillService.model.status().pipe(
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
