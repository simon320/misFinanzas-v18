import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PATH } from '../../common/enums/enum';
import { WalletStore } from '../../store/wallet.store';
import { Account, Movement } from '../../common/interfaces/interface';
import { ToastService } from '../../common/components/toast/toast.service';

@Component({
  selector: 'app-add-movement',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-movement.component.html',
  styleUrl: './add-movement.component.scss'
})
export class AddMovementComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  readonly walletStore = inject(WalletStore);
  private toastService = inject(ToastService);

  public form!: FormGroup;
  // public accounts: Signal<Account[]> = computed( () => this.walletStore.accounts() );


  ngOnInit(): void {
    this.createForm();
  }


  private createForm(): void {
    this.form = this.fb.group({
      character: false,
      accountId: ['', Validators.required],
      date: [new Date(), Validators.required],
      amount: [ , Validators.required],
      description: ["", Validators.required],
    })
  }


  private checkInvalidForm(): boolean {
    if(this.form.invalid) {
      this.toastService.show('ERROR', 'Hay campos sin completar');
      this.form.markAllAsTouched();
      return true;
    }

    else
      return false;
  }


  private checkInsufficientFunds(accountSelected: Account, amount: number, character: boolean): boolean {
    if(accountSelected?.type !== "Tarjeta de Credito" && accountSelected?.amount! < amount && character === false) {
      this.toastService.show('ERROR', 'Dinero insuficiente!');
      this.form.markAllAsTouched();
      return true;
    }

    else
      return false;
  }

  // FIXME: cambiar los movimientos a general
  private setMovementInAccount(newMovement: Movement): Account[] {
    this.walletStore.accounts().map( account => {
      if(account.id === newMovement.accountId) {
        account.movements?.unshift( newMovement );
      }
    });

    return this.walletStore.accounts();
  }


  public saveForm(): void {
    if(this.checkInvalidForm())
      return;

    const { accountId, description, amount, character, date } = this.form.value;
    let accountSelected = this.walletStore.accounts().find( account => account.id === accountId);

    if(this.checkInsufficientFunds(accountSelected!, amount, character))
      return;

    let type: 'expense' | 'income';
    let totalMoney = this.walletStore.totalMoney();

    if( character === true ) {
      type = 'income';
      totalMoney += amount;
      accountSelected!.amount += amount;
    }
    else {
      type = 'expense';
      if(accountSelected?.type !== 'Tarjeta de Credito') {
        totalMoney -= amount;
        accountSelected!.amount! -= amount;
      }
      else {
        accountSelected!.amount! += amount;
      }
    }

    const newMovement: Movement = {
      id: new Date().getTime().toString(),
      description,
      accountId: accountSelected!.id,
      amount,
      character: type,
      day: new Date(date)
    };

    this.walletStore.addMovement(totalMoney, newMovement);
    this.form.reset();
    this.toastService.show('SUCCESS', 'Se registro el movimiento');
    this.router.navigateByUrl(PATH.ACCOUNTS);
  }
}
