import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { LanguageCode, LanguageService } from 'ngx-material-translate';

@Pipe({
  name: 'customDate',
  pure: false
})
export class CustomDatePipe implements PipeTransform {
  private lastValue: string | null;
  private lastLanguageCode: LanguageCode;

  constructor(private languageService: LanguageService) {
    this.lastValue = null;
    this.lastLanguageCode = LanguageCode.Undefined;
   }

  transform(value: string | number | Date, format?: string, timezone?: string): string | null {
    const languageCode = this.languageService.business.getActiveLanguageCode();

    if(this.lastLanguageCode === languageCode) {
      return this.lastValue;
    }

    const datePipe = new DatePipe(languageCode);

    this.lastValue = datePipe.transform(value, format, timezone);
    this.lastLanguageCode = languageCode;

    return this.lastValue;
  }

}
