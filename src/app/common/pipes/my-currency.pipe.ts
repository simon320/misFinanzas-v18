import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'myCurrency'
})
export class MyCurrencyPipe implements PipeTransform {

  transform(value: string | null = '0'): string {
    if(value)
      return value.slice(0, -3).replace(',', '.');

    return '$0.0';
  }

}
