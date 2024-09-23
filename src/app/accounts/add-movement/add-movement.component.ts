import { Router } from '@angular/router';
import { Component, Signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { WalletStore } from '../../store/wallet-store.service';
import { Account, Movement } from '../../common/interfaces/interface';
import { ToastService } from '../../common/components/toast/toast.service';
import { PATH } from '../../common/enums/enum';

@Component({
  selector: 'app-add-movement',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './add-movement.component.html',
  styleUrl: './add-movement.component.scss'
})
export class AddMovementComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private walletStore = inject(WalletStore);
  private toastService = inject(ToastService);

  public form!: FormGroup;
  private readonly wallet = this.walletStore.getSignal();
  public accounts: Signal<Account[]> = computed( () => this.wallet().accounts );


  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      character: false,
      accountId: [''],
      date: [new Date(), Validators.required],
      amount: [ , Validators.required],
      description: ["", Validators.required],
    })
  }

  private setMovementInAccount(newMovement: Movement): Account[] {
    this.accounts().map( account => {
      if(account.id === newMovement.accountId) {
        account.movements?.unshift( newMovement );
      }
    });

    return this.accounts();
  }

  private checkInvalidForm(): boolean {
    if(this.form.invalid) {
      this.toastService.show('ERROR','Ups!', 'Hay campos sin completar');
      this.form.markAllAsTouched();
      return true;
    }

    else
      return false;
  }

  private checkInsufficientFunds(accountSelected: Account, amount: number, character: boolean): boolean {
    if(accountSelected?.type !== "Tarjeta de Credito" && accountSelected?.amount! < amount && character === false) {
      this.toastService.show('ERROR','Error!', 'Dinero insuficiente!');
      this.form.markAllAsTouched();
      return true;
    }

    else
      return false;
  }


  public saveForm(): void {
    if(this.checkInvalidForm()) return;

    const { accountId, description, amount, character, date } = this.form.value;
    let accountSelected = this.accounts().find( account => account.id === accountId);

    if(this.checkInsufficientFunds(accountSelected!, amount, character))
      return;

    let type: 'expense' | 'income';
    let totalMoney = this.wallet().total_money;
    if( character === true ) {
      type = 'income';
      totalMoney += amount;
      accountSelected!.amount += amount;
    } else {
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

    const newArrayAccount = this.setMovementInAccount( newMovement );
    this.walletStore.setPartialState({ total_money: totalMoney, accounts: newArrayAccount });
    this.form.reset();
    this.toastService.show('SUCCESS', 'Perfecto', 'Se registro el movimiento');
    this.router.navigateByUrl(PATH.ACCOUNTS);
  }
}
