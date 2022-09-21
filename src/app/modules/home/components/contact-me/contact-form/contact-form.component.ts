import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, take } from 'rxjs';
import { MaterialService } from 'src/app/modules/helpers/services/material/material.service';
import { MessageComponent } from 'src/app/shared/components/material/dialog/message/message.component';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  nameControl: FormControl;
  emailControl: FormControl;
  subjectControl: FormControl;
  messageControl: FormControl;
  contactForm: FormGroup;
  sending: boolean;

  constructor(
    private materialService: MaterialService,
    private sharedService: SharedService
  ) {
    this.nameControl = new FormControl('', [Validators.required]);
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.subjectControl = new FormControl('', [Validators.required]);
    this.messageControl = new FormControl('', [Validators.required]);

    this.sending = false;

    this.contactForm = new FormGroup({
      name: this.nameControl,
      email: this.emailControl,
      subject: this.subjectControl,
      message: this.messageControl
    });
  }

  onSubmit() {
    if (this.contactForm.valid && !this.sending) {
      this.sending = true;

      const subscriber = this.sharedService.request.post<{ sent: boolean, message: string }>('/send-email', this.contactForm.value, {}).
        pipe(
          take(1),
          catchError((error, caught) => {
            this.materialService.dialog.open<MessageComponent>(MessageComponent, {
              data: { header: 'Email', success: false, content: error.message },
              panelClass: 'dialog_panel'
            }).afterClosed().subscribe(() => {
              this.contactForm.reset();
            });

            this.sending = false;

            subscriber.unsubscribe();
            return caught;
          })
        ).subscribe(response => {
          this.materialService.dialog.open<MessageComponent>(MessageComponent, {
            data: { header: 'Email', success: response.sent, content: response.message },
            panelClass: 'dialog_panel'
          }).afterClosed().subscribe(() => {
            this.contactForm.reset();
          });

          this.sending = false;
        });
    }
  }

  ngOnInit(): void {
  }
}
