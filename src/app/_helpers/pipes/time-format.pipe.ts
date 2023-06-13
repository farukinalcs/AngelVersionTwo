import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number): string {
    const hours: number = Math.floor(value / 60);
    const minutes: number = value % 60;
    const formattedHours: string = hours.toString().padStart(2, '0');
    const formattedMinutes: string = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

}
