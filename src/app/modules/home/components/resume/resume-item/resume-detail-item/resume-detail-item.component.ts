import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { LanguageService } from 'ngx-material-translate';
import { TextReadComponent } from 'ngx-text-animation';
import { filter, Subscription, take, timer } from 'rxjs';
import { ResumeService } from 'src/app/modules/home/services/resume/resume.service';
import { Required } from 'src/app/shared/decorators/required/required.decorator';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Resume } from '../../../../models/resume/resume.interface';

@Component({
  selector: 'app-resume-detail-item',
  templateUrl: './resume-detail-item.component.html',
  styleUrls: ['./resume-detail-item.component.scss']
})
export class ResumeDetailItemComponent {
  @Input() @Required('app-resume-detail-item') item?: Resume;

  @ViewChild(TextReadComponent) textRead?: TextReadComponent;
  @ViewChild('detailBall', { static: false }) detailBall?: ElementRef<HTMLDivElement>;

  isLoading: boolean;
  isLoaded: boolean;

  private subscriptions: Subscription[];

  constructor(
    public resumeService: ResumeService,
    private languageService: LanguageService,
    private renderer2: Renderer2) {
    this.subscriptions = [];

    this.isLoading = false;
    this.isLoaded = false;
   }

  onMouseOver() {
    if (this.detailBall) {
      const detailElem = this.detailBall.nativeElement;
      this.renderer2.addClass(detailElem, 'theme-accent_background');
    }
  }

  onMouseLeave() {
    if (this.detailBall) {
      const detailElem = this.detailBall.nativeElement;
      this.renderer2.removeClass(detailElem, 'theme-accent_background');
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      const firstLoad = languageCode === lastActiveLanguageCode;

      if (!firstLoad) {
        this.isLoading = true;
        this.isLoaded = false;

        this.resumeService.model.status().pipe(
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

  ngAfterViewInit() {
    if(this.textRead) {
      this.textRead.reveal();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
