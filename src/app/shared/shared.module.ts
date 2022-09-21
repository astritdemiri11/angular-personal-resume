import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { MessageComponent } from './components/material/dialog/message/message.component';
import { DisplayModeDirective } from './directives/display-mode/display-mode.directive';
import { CustomDatePipe } from './pipes/custom-date/custom-date.pipe';

const materialModules = [
  MatButtonModule,
  MatDialogModule
];

@NgModule({
  declarations: [
    CustomDatePipe,
    DisplayModeDirective,
    MessageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    materialModules
  ],
  exports: [
    CommonModule,
    CustomDatePipe,
    DisplayModeDirective,
    MessageComponent
  ]
})
export class SharedModule { }
