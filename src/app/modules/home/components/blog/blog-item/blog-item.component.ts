import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { LanguageService, ResponseType } from 'ngx-material-translate';
import { filter, Subscription, take, timer } from 'rxjs';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.interface';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { BlogService } from '../../../services/blog/blog.service';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss']
})
export class BlogItemComponent {
  @Input() @Required('app-blog-item') item?: Blog;
  @ViewChild('blogLink', { static: false }) blogLink?: ElementRef<HTMLAnchorElement>;

  isLoading: boolean;
  isLoaded: boolean;

  private subscriptions: Subscription[];

  constructor(
    public blogService: BlogService,
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
