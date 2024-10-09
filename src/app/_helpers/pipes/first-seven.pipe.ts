import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstSeven'
})
export class FirstSevenPipe implements PipeTransform {

  transform(array: any[], index: number): any[] {
    return array[index];
  }

}
