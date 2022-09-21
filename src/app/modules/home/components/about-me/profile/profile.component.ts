import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageInterface, LanguageService, ResponseType } from 'ngx-material-translate';
import { TextReadComponent } from 'ngx-text-animation';
import { filter, fromEvent, Subscription, take, timer } from 'rxjs';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { Contact } from '../../../models/contact/contact.interface';
import { Profile } from '../../../models/profile/profile.interface';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input() @Required('app-profile') profile?: Profile | null;
  @Input() @Required('app-profile') contact?: Contact | null;

  @ViewChild(TextReadComponent, { static: false }) textRead?: TextReadComponent;

  isLoading: boolean;
  isLoaded: boolean;
  languages: { [key: string]: LanguageInterface }

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    private languageService: LanguageService,
    private profileService: ProfileService) {
    this.subscriptions = [];

    this.isLoading = false;
    this.isLoaded = false;
    this.languages = {};
  }

  getPhone() {
    if (this.contact) {
      return this.contact.phones[0].replace(/-/g, '');
    }

    return '';
  }

  ngOnInit() {
    if (!this.layoutService.model.isBrowser || !this.document.defaultView) {
      return;
    }

    const scrollObserver = fromEvent(this.document.defaultView, 'scroll').subscribe(() => {
      if (this.textRead && this.textRead.elementRef) {
        const elementTop = this.textRead.elementRef.nativeElement.getBoundingClientRect().top;

        if (this.document.defaultView && elementTop <= this.document.defaultView.innerHeight) {
          this.textRead.start();
          scrollObserver.unsubscribe();
        }
      }
    });

    this.subscriptions.push(scrollObserver);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.languageService.model.status$.pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.languages = this.languageService.business.getLanguageEntities();
      });

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

            if(this.textRead && this.textRead.reading) {
              this.textRead.restart();
            }
          });
        });
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
