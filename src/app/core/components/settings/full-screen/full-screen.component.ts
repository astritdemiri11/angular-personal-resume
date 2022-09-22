import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.scss']
})
export class FullScreenComponent implements OnInit {
  fullScreen: boolean;

  private subscriptions: Subscription[];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private layoutService: LayoutService) {
    this.fullScreen = false;
    this.subscriptions = [];
  }

  onToggleFullScreen() {
    if (this.fullScreen) {
      this.document.exitFullscreen();
    } else {
      this.document.documentElement.requestFullscreen();
    }

    this.fullScreen = !this.fullScreen;
  }

  ngOnInit() {
    if (!this.layoutService.model.isBrowser) {
      return;
    }

    if (this.document.defaultView && this.layoutService.model.isBrowser) {
      this.fullScreen = this.document.defaultView.innerHeight == screen.height;

      this.subscriptions.push(this.layoutService.model.resize$.subscribe(() => {
        if (this.document.defaultView) {
          this.fullScreen = this.document.defaultView.innerHeight == screen.height;
        }
      }));
    }
  }
}
