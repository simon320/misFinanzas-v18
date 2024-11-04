import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[currencyFormat]'
})
export class CurrencyFormatDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9,]/g, '');

    if (value.includes(',')) {
      const parts = value.split(',');
      parts[1] = parts[1].slice(0, 2); // limitar decimales a 2 dígitos
      value = parts.join(',');
    }

    const regex = /(\d)(?=(\d{3})+(?!\d))/g;
    value = value.replace(regex, '$1.');

    this.ngControl.control?.setValue(`$${value}`);
  }
}
