import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { header: string, success: boolean, content: string },
    public dialogRef: DialogRef<MessageComponent>
  ) { }
}

