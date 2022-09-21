import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotFoundResolver implements Resolve<boolean> {
  constructor() {}

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return true;
  }
}
