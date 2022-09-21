import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, makeStateKey, Title, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService, TranslateService } from 'ngx-material-translate';
import { filter, interval, skip, Subscription, take } from 'rxjs';
import { Menu } from 'src/app/modules/helpers/models/menu/menu.interface';
import { MenuService } from 'src/app/modules/helpers/services/menu/menu.service';

import { QUOTE_SVG } from '../../constants/other-svg.constant';
import {
  FACEBOOK_SVG,
  GITHUB_SVG,
  INSTAGRAM_SVG,
  LINKEDIN_SVG,
  SKYPE_SVG,
  TWITTER_SVG,
} from '../../constants/social-media-svg.constant';
import { REQUEST_URL } from '../../constants/url.constant';
import { ContactDTO } from '../../models/contact/contact.interface';
import { ContactService } from '../../services/contact/contact.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('fragmentElem', { read: ElementRef }) fragmentElem?: QueryList<ElementRef<HTMLElement>>;

  private subscriptions: Subscription[];

  constructor(
    public menuService: MenuService,
    @Inject(DOCUMENT) private document: Document,
    private transferState: TransferState,
    private titleService: Title,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private contactService: ContactService,
    private profileService: ProfileService) {
    this.subscriptions = [];
  }

  ngOnInit() {
    const menus: Menu[] = [
      { routerLink: '/', feature: 'core', fragment: 'intro', translation: 'menu.home' },
      { routerLink: '/', feature: 'core', fragment: 'aboutMe', translation: 'menu.about' },
      { routerLink: '/', feature: 'core', fragment: 'resume', translation: 'menu.resume' },
      { routerLink: '/', feature: 'core', fragment: 'portfolio', translation: 'menu.portfolio' },
      { routerLink: '/', feature: 'core', fragment: 'blog', translation: 'menu.blog' },
      { routerLink: '/', feature: 'core', fragment: 'contactMe', translation: 'menu.contact' }
    ];

    this.menuService.model.headerMenus$.next(menus);

    const contact = this.transferState.get<ContactDTO | null>(makeStateKey('contact'), null);

    if (contact) {
      this.contactService.business.addContact(this.contactService.business.convertDTO(contact));
    } else {
      const serverUrl = REQUEST_URL.host;
      const feature = REQUEST_URL.json;

      this.contactService.business.loadContact(`${serverUrl}/${feature.contact}`);
    }

    this.contactService.model.contact$.pipe(filter(contact => !!contact), take(1)).subscribe(contact => {
      if (contact && contact.phones.length) {
        this.menuService.model.phoneNumber$.next(contact.phones[0]);
      }
    });

    this.profileService.model.profile().pipe(filter(profile => !!profile), take(1)).subscribe(profile => {
      if (profile) {
        const resumeKeyTranslation = this.translateService.business.getTranslation('home', 'resume');

        if (resumeKeyTranslation) {
          this.titleService.setTitle(`${resumeKeyTranslation} - ${profile.name} ${profile.surname}`);
        } else {
          this.titleService.setTitle(`${profile.name} ${profile.surname}`);
        }
      }
    });

    this.profileService.model.profile().pipe(filter(profile => !!profile), take(1)).subscribe(profile => {
      if (profile) {
        const resumeKeyTranslation = this.translateService.business.getTranslation('home', 'resume');

        if (resumeKeyTranslation) {
          this.titleService.setTitle(`${resumeKeyTranslation} - ${profile.name} ${profile.surname}`);
        } else {
          this.titleService.setTitle(`${profile.name} ${profile.surname}`);
        }
      }
    });

    this.matIconRegistry.addSvgIconLiteralInNamespace('other', 'quote',
      this.domSanitizer.bypassSecurityTrustHtml(QUOTE_SVG));

    this.matIconRegistry.addSvgIconSetInNamespace('service',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/svg/service.svg'));

    this.matIconRegistry.addSvgIconLiteralInNamespace('social-media', 'facebook',
      this.domSanitizer.bypassSecurityTrustHtml(FACEBOOK_SVG));

    this.matIconRegistry.addSvgIconLiteralInNamespace('social-media', 'github',
      this.domSanitizer.bypassSecurityTrustHtml(GITHUB_SVG));

    this.matIconRegistry.addSvgIconLiteralInNamespace('social-media', 'linkedIn',
      this.domSanitizer.bypassSecurityTrustHtml(LINKEDIN_SVG));

    this.matIconRegistry.addSvgIconLiteralInNamespace('social-media', 'instagram',
      this.domSanitizer.bypassSecurityTrustHtml(INSTAGRAM_SVG));

    this.matIconRegistry.addSvgIconLiteralInNamespace('social-media', 'skype',
      this.domSanitizer.bypassSecurityTrustHtml(SKYPE_SVG));

    this.matIconRegistry.addSvgIconLiteralInNamespace('social-media', 'twitter',
      this.domSanitizer.bypassSecurityTrustHtml(TWITTER_SVG));

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (languageCode !== lastActiveLanguageCode) {
        this.translateService.business.loadTranslations('home');
      }
    }));
  }

  ngAfterViewInit() {
    if (!this.layoutService.model.isBrowser || !this.document.defaultView) {
      return;
    }

    if (this.fragmentElem) {
      this.fragmentElem.forEach(fragmentElem => {
        this.menuService.model.fragmentElem[fragmentElem.nativeElement.id] = fragmentElem;
      })
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      fragment: 'intro',
      queryParamsHandling: 'merge'
    });

    let intervalSubscription: Subscription | null;

    this.subscriptions.push(this.activatedRoute.fragment.pipe(skip(1)).subscribe(fragment => {
      if (intervalSubscription) {
        intervalSubscription.unsubscribe();
      }

      if (this.document.defaultView && fragment) {
        const element = this.menuService.model.fragmentElem[fragment];

        if (element) {
          const elementTop = element.nativeElement.getBoundingClientRect().top;

          this.document.defaultView.scroll({
            top: this.document.defaultView.scrollY + elementTop - 80,
            behavior: 'smooth'
          });

          if (elementTop >= 0 && !element.nativeElement.innerText) {
            const heightCheck$ = interval(400);
            let tries = 0;

            intervalSubscription = heightCheck$.subscribe(() => {
              if (this.document.defaultView) {
                const elementTop = element.nativeElement.getBoundingClientRect().top;

                if (elementTop <= this.document.defaultView.innerHeight) {
                  tries++;
                }

                if (tries <= 2 && elementTop) {
                  this.document.defaultView.scroll({
                    top: this.document.defaultView.scrollY + elementTop - 80,
                    behavior: 'smooth'
                  });
                } else if (intervalSubscription) {
                  intervalSubscription.unsubscribe();
                  intervalSubscription = null;
                }
              }
            });
          }
        }
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
