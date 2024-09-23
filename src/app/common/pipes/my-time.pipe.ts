import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'myTime'
})
export class MyTimePipe implements PipeTransform {

  transform(value: Date): string {
    let hours = '00';
    let minutes = '00';

    if(value) {
      hours = value?.getHours().toString();
      minutes = value?.getMinutes().toString();

      if(hours.length === 1) hours = '0' + hours;
      if(minutes.length === 1) minutes = '0' + minutes;

    }
      return hours + ':' + minutes + 'hs';
  }

}
