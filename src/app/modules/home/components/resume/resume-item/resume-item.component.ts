import { Component, Input } from '@angular/core';
import { Required } from 'src/app/shared/decorators/required/required.decorator';

import { Resume } from '../../../models/resume/resume.interface';

@Component({
  selector: 'app-resume-item',
  templateUrl: './resume-item.component.html',
  styleUrls: ['./resume-item.component.scss']
})
export class ResumeItemComponent {
  @Input() @Required('app-resume-item') item?: Resume[] | null;
  @Input() @Required('app-resume-item') icon?: string;
  @Input() @Required('app-resume-item') title?: string;
}
