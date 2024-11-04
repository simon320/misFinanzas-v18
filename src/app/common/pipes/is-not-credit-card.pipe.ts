import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '../interfaces/interface';

@Pipe({
  standalone: true,
  name: 'inNotCredit'
})
export class IsNotCreditCard implements PipeTransform {

  transform(accounts: Account[]): Account[] {
    return accounts.filter( account => account.type !== 'Tarjeta de Credito');
  }

}
