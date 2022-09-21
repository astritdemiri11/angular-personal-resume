import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { REQUEST_URL } from '../../constants/url.constant';
import { Resume } from '../../models/resume/resume.interface';
import { ResumeService } from '../../services/resume/resume.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  education: Resume[];
  experience: Resume[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    private languageService: LanguageService,
    public resumeService: ResumeService) {
      this.subscriptions = [];
      this.education = [];
      this.experience = [];
     }

  ngOnInit() {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.resumeService.business.loadResume(`${serverUrl}/${feature.resume.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.resumeService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.education = this.resumeService.business.getEducation();
        this.experience = this.resumeService.business.getExperience();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.resumeService.business.translateResume(`${serverUrl}/${feature.resume.translate}`);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
