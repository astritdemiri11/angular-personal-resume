import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { REQUEST_URL } from '../../constants/url.constant';
import { Skill } from '../../models/skill/skill.interface';
import { SkillService } from '../../services/skill/skill.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit, OnDestroy {
  skills: Skill[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    private languageService: LanguageService,
    private skillService: SkillService) {
    this.subscriptions = [];
    this.skills = [];
  }

  ngOnInit() {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.skillService.business.loadSkills(`${serverUrl}/${feature.skill.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.skillService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.skills = this.skillService.business.getSkills();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.skillService.business.translateSkills(`${serverUrl}/${feature.skill.translate}`);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
