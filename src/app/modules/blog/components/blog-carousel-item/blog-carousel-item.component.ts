import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take, timer } from 'rxjs';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.interface';

import { ResponseType } from '../../models/response/response.enum';
import { BlogService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-blog-carousel-item',
  templateUrl: './blog-carousel-item.component.html',
  styleUrls: ['./blog-carousel-item.component.scss']
})
export class BlogCarouselItemComponent implements OnInit {
  @Input() item?: Blog;
  @ViewChild('blogLink', { static: false }) blogLink?: ElementRef<HTMLAnchorElement>;

  isLoading: boolean;
  isLoaded: boolean;

  private subscriptions: Subscription[];

  constructor(
    public blogService: BlogService,
    public layoutService: LayoutService,
    private languageService: LanguageService,
    private renderer2: Renderer2) {
    this.subscriptions = [];

    this.isLoading = false;
    this.isLoaded = false;
  }

  onMouseOver() {
    if (this.blogLink) {
      const linkElem = this.blogLink.nativeElement;
      this.renderer2.addClass(linkElem, 'theme-accent_color');
    }
  }

  onMouseLeave() {
    if (this.blogLink) {
      const linkElem = this.blogLink.nativeElement;
      this.renderer2.removeClass(linkElem, 'theme-accent_color');
    }
  }

  ngOnInit() {
    if(!this.item) {
      throw new Error('app-carousel-item [item] attribute is required');
    }

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      const firstLoad = languageCode === lastActiveLanguageCode;

      if (!firstLoad) {
        this.isLoading = true;
        this.isLoaded = false;

        this.blogService.model.status().pipe(
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
