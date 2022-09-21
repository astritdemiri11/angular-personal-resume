import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-settings',
  templateUrl: './bottom-settings.component.html',
  styleUrls: ['./bottom-settings.component.scss']
})
export class BottomSettingsComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSettingsComponent>) { }

  onToolbarClick() {
    this.bottomSheetRef.dismiss();
  }
}
