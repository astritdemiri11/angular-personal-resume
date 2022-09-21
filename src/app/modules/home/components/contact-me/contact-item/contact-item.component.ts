import { Component, Input } from '@angular/core';
import { Required, RequiredProps } from 'src/app/shared/decorators/required/required.decorator';


@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss']
})
@RequiredProps('app-contact-item', 'label', 'icon', 'values')
export class ContactItemComponent {
  @Input() @Required('app-contact-item') type?: 'email' | 'phone' | 'address';
  @Input() label?: string;
  @Input() icon?: string;
  @Input() values?: string[];

  getLink(value: string) {
    if(!this.type) {
      return '';
    }

    if(this.type === 'email') {
      return 'mailto:' + value;
    }

    if(this.type === 'phone') {
      return 'tel:' + value.replace(/-/g, '');
    }

    if(this.type === 'address') {
      return 'http://maps.google.com/?q=' + value;
    }

    return '';
  }
}
