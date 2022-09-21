import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take } from 'rxjs';
import { THEME_COLOR_MAP } from 'src/app/core/constants/theme.constant';
import { ThemeType } from 'src/app/core/models/theme/theme.enum';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ResponseType } from 'src/app/shared/models/response/response.enum';
import { EasingType, HoverMode, MoveDirection, OutMode } from 'tsparticles-engine';

import { REQUEST_URL } from '../../constants/url.constant';
import { Profile, ProfileDTO } from '../../models/profile/profile.interface';
import { SocialMediaItem, SocialMediaItemDTO } from '../../models/social-media/social-media-item.interface';
import { ProfileService } from '../../services/profile/profile.service';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, OnDestroy {
  profile: Profile | null;
  socialMediaItems: SocialMediaItem[];
  particleOptions: any;
  imgSrc: string;

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    public profileService: ProfileService,
    public socialMediaService: SocialMediaService,
    private languageService: LanguageService,
    private transferState: TransferState,
    private elementRef: ElementRef,
    private settingsService: SettingsService
  ) {
    this.subscriptions = [];

    this.profile = null;
    this.socialMediaItems = [];
    this.particleOptions = {
      fullScreen: {
        enable: false
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: HoverMode.attract
          },
          resize: true
        },
        modes: {
          attract: {
            distance: 200,
            duration: 0.4,
            easing: EasingType.easeOutQuad,
            factor: 1,
            maxSpeed: 50,
            speed: 1
          },
          push: {
            particles_nb: 4
          }
        }
      },
      particles: {
        collisions: {
          enable: true
        },
        color: {
          value: '#fff',
        },
        move: {
          enable: true,
          speed: 0.2,
          direction: MoveDirection.none,
          random: true,
          straight: false,
          outMode: OutMode.out,
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        },
        number: {
          value: 150,
          density: {
            enable: true,
            valueArea: 789.1476416322727
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: true,
            speed: 0.6,
            opacityMin: 0,
            sync: false
          }
        },
        shape: {
          image: {
            width: 100,
            height: 100
          },
          polygon: {
            nbSides: 5
          },
          stroke: {
            width: 0,
            color: "#000000"
          },
          type: "circle"
        },
        size: {
          value: 2,
          random: true,
          anim: {
            enable: true,
            speed: 5,
            sizeMin: 0,
            sync: false
          }
        }
      },
      detectRetina: true
    };

    this.imgSrc = '';
  }

  calcImageWidth() {
    const introContainer = this.elementRef.nativeElement;

    return introContainer.offsetHeight + 'px';
  }

  calcInfoWidth() {
    if (this.layoutService.business.isHandset()) {
      return '100%';
    }

    const introContainer = this.elementRef.nativeElement;
    return (introContainer.offsetWidth - introContainer.offsetHeight) + 'px';
  }

  calcMediaWidth() {
    if (this.layoutService.business.isHandset()) {
      return '100%';
    }

    const introContainer = this.elementRef.nativeElement;
    return introContainer.offsetHeight / 2 + 'px';
  }

  async ngOnInit() {
    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    const profile = this.transferState.get<ProfileDTO | null>(makeStateKey('profile'), null);

    if (profile) {
      this.profileService.business.addProfile(this.profileService.business.convertDTO(profile));
    } else {
      this.profileService.business.loadProfile(`${serverUrl}/${feature.profile.load}`);
    }

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.profileService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.profile = this.profileService.business.getProfile();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.profileService.business.translateProfile(`${serverUrl}/${feature.profile.translate}`);
      }
    }));

    this.subscriptions.push(this.settingsService.model.theme$.subscribe((theme: ThemeType) => {
      if (theme) {
        const themeColorMap = THEME_COLOR_MAP[theme];

        this.particleOptions = {
          ...this.particleOptions,
          particles: {
            ...this.particleOptions.particles,
            color: { ...this.particleOptions.particles.color, value: themeColorMap.textColor }
          }
        }
      }
    }));

    const socialMedia = this.transferState.get<SocialMediaItemDTO[] | null>(makeStateKey('socialMedia'), null);

    if (socialMedia) {
      this.socialMediaService.business.addSocialMedia(this.socialMediaService.business.convertDTOs(socialMedia));
    } else {
      this.socialMediaService.business.loadSocialMedia(`${serverUrl}/${feature.socialMedia}`);
    }

    this.subscriptions.push(this.layoutService.model.handset$.subscribe(handset => {
      this.socialMediaService.model.status$.pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.socialMediaItems = this.socialMediaService.business.getSocialMedia(handset ? 5 : null);
      });
    }));

    this.subscriptions.push(this.settingsService.model.theme$.subscribe(theme => {
      this.imgSrc = `/assets/images/webp/profile_${THEME_COLOR_MAP[theme].primaryName}.webp`;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
