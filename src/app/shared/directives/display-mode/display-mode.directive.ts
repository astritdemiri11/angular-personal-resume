import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { fromEvent, Subscription } from 'rxjs';

import { Required } from '../../decorators/required/required.decorator';

@Directive({
  selector: '[appDisplayMode]'
})
export class DisplayModeDirective implements AfterViewInit, OnDestroy {
  @Input() @Required('[appDisplayMode]') appDisplayMode?: string;

  private subscriptions: Subscription[];
  private scrollSubscription?: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private layoutService: LayoutService) {
    this.subscriptions = [];
  }

  ngAfterViewInit() {
    if (!this.layoutService.model.isBrowser || !this.document.defaultView) {
      return;
    }

    this.tryDisplay();

    this.scrollSubscription = fromEvent(this.document.defaultView, 'scroll').subscribe(() => {
      this.tryDisplay();
    });

    this.subscriptions.push(this.scrollSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private tryDisplay() {
    if (this.appDisplayMode && this.document.defaultView) {
      const elementTop = this.elementRef.nativeElement.getBoundingClientRect().top;

      if (elementTop <= this.document.defaultView.innerHeight) {
        this.renderer2.addClass(this.elementRef.nativeElement, this.appDisplayMode);
      }
    }
  }
}
