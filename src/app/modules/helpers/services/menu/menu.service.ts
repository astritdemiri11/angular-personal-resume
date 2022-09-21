import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

import { Menu } from '../../models/menu/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  model = this.getModel();
  business = this.getBusiness();

  private _scrollingElem: ElementRef<HTMLElement> | null;

  constructor() {
    this._scrollingElem = null;
  }

  private getModel(): {
    footerMenus$: BehaviorSubject<Menu[]>,
    headerMenus$: BehaviorSubject<Menu[]>,
    phoneNumber$: BehaviorSubject<string | null>,
    fragmentElem: { [key: string]: ElementRef<HTMLElement> },
    scrollingElem: ElementRef<HTMLElement> | null
  } {
    const self = this;

    return {
      footerMenus$: new BehaviorSubject<Menu[]>([]),
      fragmentElem: {},
      headerMenus$: new BehaviorSubject<Menu[]>([]),
      phoneNumber$: new BehaviorSubject<string | null>(null),
      get scrollingElem() {
        return self._scrollingElem;
      },
      set scrollingElem(value: ElementRef<HTMLElement> | null) {
        if (self._scrollingElem) {
          throw new Error('Content element already set');
        }

        self._scrollingElem = value;
      }
    }
  }

  private getBusiness() {
    return {
      getPhone: (replace: boolean = false) => {
        let phone: string = '';

        this.model.phoneNumber$.pipe(take(1)).subscribe(tel => {
          if (tel) {
            phone = tel;

            if (replace) {
              phone = phone.replace(/-/g, '');
            }
          }
        });

        return phone;
      }
    }
  }
}
