import { Component } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { CarouselConfig } from 'ngx-scroll-carousel';
import { filter, Subscription, take } from 'rxjs';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.interface';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { REQUEST_URL } from '../../constants/url.constant';
import { BlogService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  carouselConfigs: CarouselConfig;
  blogs: Blog[];

  private subscriptions: Subscription[];

  constructor(
    public layoutService: LayoutService,
    private languageService: LanguageService,
    private blogService: BlogService) {
    this.carouselConfigs = {
      items: 0
    }

    this.blogs = [];
    this.subscriptions = [];
  }

  ngOnInit() {
    this.carouselConfigs = {
      items: 0,
      itemsGapPX: 16,
      controlsActiveClass: 'theme-accent_background',
      controlsButtonClass: 'theme-primary_background_300',
      controlsOverClass: 'theme-accent_background_200',
      navigationIconClass: 'theme-accent_color',
      navigation: false,
      speed: 3000,
      omitChanges: true
    };

    this.subscriptions.push(this.layoutService.model.handset$.subscribe(handset => {
      this.carouselConfigs = { ...this.carouselConfigs, items: handset ? 1 : 3, navigation: handset };
    }));

    const serverUrl = REQUEST_URL.host;
    const feature = REQUEST_URL.json;

    this.blogService.business.loadBlogs(`${serverUrl}/${feature.blog.load}`);

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      this.blogService.model.status().pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        this.blogs = this.blogService.business.getBlogs();
      });

      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      if (lastActiveLanguageCode !== languageCode) {
        this.blogService.business.translateBlogs(`${serverUrl}/${feature.blog.translate}`);
      }
    }));
  }
}
