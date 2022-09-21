import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  model = this.modelGet();

  private modelGet() {
    return {
      appMode$: new BehaviorSubject<boolean>(false)
    }
  }
}
