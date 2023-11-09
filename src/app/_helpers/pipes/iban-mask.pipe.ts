import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ibanMask'
})
export class IbanMaskPipe implements PipeTransform {

  transform(value: string): string {
    if (value && value.length === 26) {
      const maskedIban = 'TR' + value.slice(2, 4) + ' ' +
        value.slice(4, 8) + ' **** **** **** **** **' +
        value.slice(22, 24) + ' ' + value.slice(24);
      return maskedIban;
    } else {
      return value;
    }
  }

}
