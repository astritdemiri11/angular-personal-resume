import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { LanguageService } from 'ngx-material-translate';
import { filter, Subscription, take, timer } from 'rxjs';
import { Required } from 'src/app/shared/decorators/required/required.decorator';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Product } from '../../../models/product/product.interface';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ServiceItemComponent {
  @Input() @Required('app-product-item') item?: Product;
  @ViewChild('iconTitle', { static: false }) iconTitle?: ElementRef<HTMLDivElement>;

  isLoading: boolean;
  isLoaded: boolean;

  private subscriptions: Subscription[];

  constructor(
    public productService: ProductService,
    private languageService: LanguageService,
    private renderer2: Renderer2) {
    this.subscriptions = [];

    this.isLoading = false;
    this.isLoaded = false;
  }

  onMouseOver() {
    if (this.iconTitle) {
      const iconTitleElem = this.iconTitle.nativeElement;

      this.renderer2.addClass(iconTitleElem, 'mouse-over');
      this.renderer2.addClass(iconTitleElem, 'theme-accent_color');
    }
  }

  onMouseLeave() {
    if (this.iconTitle) {
      const iconTitleElem = this.iconTitle.nativeElement;

      this.renderer2.removeClass(iconTitleElem, 'mouse-over');
      this.renderer2.removeClass(iconTitleElem, 'theme-accent_color');
    }
  }

  ngOnInit() {
    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      const firstLoad = languageCode === lastActiveLanguageCode;

      if (!firstLoad) {
        this.isLoading = true;
        this.isLoaded = false;

        this.productService.model.status().pipe(
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
