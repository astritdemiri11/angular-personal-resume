import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { PortfolioItem } from '../../../../helpers/models/portfolio/portfolio-item.interface';

@Component({
  selector: 'app-portfolio-item',
  templateUrl: './portfolio-item.component.html',
  styleUrls: ['./portfolio-item.component.scss']
})
export class PortfolioItemComponent implements AfterViewInit {
  @Input() @Required('app-portfolio-item') item?: PortfolioItem;

  @ViewChild('video', { static: false }) video?: ElementRef<HTMLVideoElement>;

  playing: boolean;

  constructor() {
    this.playing = false;
  }

  onPlayToggle() {
    if (this.video) {
      if (this.playing) {
        this.video.nativeElement.pause();
      } else {
        this.video.nativeElement.play();
        this.video.nativeElement.requestFullscreen();
      }

      this.playing = !this.playing;
    }
  }

  ngAfterViewInit() {
    if (this.video) {
      this.video.nativeElement.onended = (_event: Event) => {
        this.playing = false;

        if (this.video && this.video.nativeElement.clientHeight == screen.height) {
          this.video.nativeElement.ownerDocument.exitFullscreen();
        }
      }
    }
  }
}
