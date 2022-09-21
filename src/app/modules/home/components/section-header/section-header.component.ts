import { Component, Input } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {
  @Input() @Required('app-section-header') label?: string;

  constructor(public layoutService: LayoutService) { }
}
