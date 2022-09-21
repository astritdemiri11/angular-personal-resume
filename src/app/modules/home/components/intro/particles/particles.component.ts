import { Component, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { from, take } from 'rxjs';
import { Required } from 'src/app/shared/decorators/required/required.decorator';
import { ParticlesOptions, tsParticles } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss']
})
export class ParticlesComponent implements OnInit, OnChanges {
  @Input() @Required('app-particles') options?: ParticlesOptions;

  private loaded: boolean;

  constructor(public renderer2: Renderer2) {
    this.loaded = false;
   }

  ngOnInit() {
    if(!this.options) {
      throw new Error(`app-particles component, [options] attribute is required`);
    }
  }

  ngOnChanges() {
    if (this.options) {
      if(this.loaded) {
        tsParticles.load('particles-js', this.options);
      } else {
        from(loadSlim(tsParticles)).pipe(take(1)).subscribe(() => {
          tsParticles.load('particles-js', this.options);
          this.loaded = true;
        });
      }
    }
  }
}
