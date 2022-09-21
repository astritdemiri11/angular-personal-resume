import { Component } from '@angular/core';
import { LayoutService } from 'ngx-arrangement';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(
    public layoutService: LayoutService) {
   }
}
