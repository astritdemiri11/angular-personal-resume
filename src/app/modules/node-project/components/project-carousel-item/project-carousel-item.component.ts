import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PortfolioItem as Project } from 'src/app/modules/helpers/models/portfolio/portfolio-item.interface';

@Component({
  selector: 'app-project-carousel-item',
  templateUrl: './project-carousel-item.component.html',
  styleUrls: ['./project-carousel-item.component.scss']
})
export class ProjectCarouselItemComponent implements AfterViewInit {
  @Input() item?: Project;

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

