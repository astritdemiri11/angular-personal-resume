import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { BottomSettingsComponent } from './bottom-settings/bottom-settings.component';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent {

  constructor(private bottomSheet: MatBottomSheet) { }

  onButtonClick() {
    this.bottomSheet.open(BottomSettingsComponent, {
      ariaLabel: 'Bottom settings',
      panelClass: 'bottom-sheet_panel'
    });
  }
}
