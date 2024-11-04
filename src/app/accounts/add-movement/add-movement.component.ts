import { Router } from '@angular/router';
import { Component, ElementRef, inject, Renderer2, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PATH } from '../../common/enums/enum';
import { WalletStore } from '../../store/wallet.store';
import { Account, Movement } from '../../common/interfaces/interface';
import { ToastService } from '../../common/components/toast/toast.service';
import { IsNotCreditCard } from "../../common/pipes/is-not-credit-card.pipe";


@Component({
  selector: 'app-add-movement',
  standalone: true,
  imports: [ReactiveFormsModule, IsNotCreditCard],
  templateUrl: './add-movement.component.html',
  styleUrl: './add-movement.component.scss'
})
export class AddMovementComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private render = inject(Renderer2);
  readonly walletStore = inject(WalletStore);
  private toastService = inject(ToastService);

  public form!: FormGroup;

  private accountSelected = signal<Account>({});
  public checkboxPayContainer = viewChild<ElementRef>('checkboxPayContainer');
  public selectAccount = viewChild<ElementRef>('selectAccount');
  public characterMovement = viewChild<ElementRef>('characterMovement');
  public selectAccountDebit = viewChild<ElementRef>('selectAccountDebit');
  public isTotalPay = signal<boolean>(false);

  formattedValue: string = '';



  ngOnInit(): void {
    this.createForm();
    this.observerTotalPay();
  }


  private createForm(): void {
    this.form = this.fb.group({
      character: false,
      checkPay: false,
      accountId: ['', Validators.required],
      accountDebitId: [''],
      date: [new Date(), Validators.required],
      amount: [ , Validators.required],
      description: ["", Validators.required],
    })
  }


  private observerTotalPay(): void {
    this.form.get('accountId')?.valueChanges.subscribe( accountId => {
      this.accountSelected.set(this.walletStore.accounts().find( account => account.id === accountId)!);
      if(this.accountSelected()?.type === 'Tarjeta de Credito') {
        this.render.addClass(this.selectAccount()?.nativeElement, 'is__credit')
        this.render.addClass(this.checkboxPayContainer()?.nativeElement, 'checkbox__pay')
      }
      else {
        this.render.removeClass(this.selectAccount()?.nativeElement, 'is__credit')
        this.render.removeClass(this.checkboxPayContainer()?.nativeElement, 'checkbox__pay')
      }
    })

    this.form.get('checkPay')?.valueChanges.subscribe( check => {
      if(check) {
        this.form.get('amount')?.setValue(this.accountSelected().amount)
        this.form.get('description')?.setValue("Pago total de " + this.accountSelected().name)
        this.render.addClass(this.selectAccountDebit()?.nativeElement, 'select__account__debit')
        this.render.addClass(this.characterMovement()?.nativeElement, 'character__movement')
        this.isTotalPay.set(true);
      }
      else {
        this.form.get('amount')?.setValue(null)
        this.form.get('description')?.setValue("")
        this.render.removeClass(this.selectAccountDebit()?.nativeElement, 'select__account__debit')
        this.render.removeClass(this.characterMovement()?.nativeElement, 'character__movement')
        this.isTotalPay.set(false);
      }
    })
  }


  private checkInvalidForm(): boolean {
    if(this.form.invalid) {
      this.toastService.show('ERROR', 'Hay campos sin completar');
      this.form.markAllAsTouched();
      return true;
    }

    if(this.isTotalPay() && (this.form.get('accountDebitId')?.value === '')) {
      this.toastService.show('ERROR', 'Seleccione la cuenta a debitar el pago total.');
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


  public saveForm(): void {
    if(this.checkInvalidForm())
      return;

    const { accountId, accountDebitId, description, amount, character, date } = this.form.value;

    let accountSelected: Account[] = [];
    accountSelected.push(this.walletStore.accounts().find( account => account.id === accountId)!);
    accountDebitId && accountSelected.push(this.walletStore.accounts().find( account => account.id === accountDebitId)!);

    const isCreditCard = accountSelected[0]!.type === 'Tarjeta de Credito';
    const isDebitedCreditCard = accountSelected[0]!.debit;
    const isTotalPay = accountSelected.length;

    const positionAccountToBeDebited = isTotalPay ? 1 : 0;

    if(this.checkInsufficientFunds(accountSelected[positionAccountToBeDebited]!, amount, character))
      return;

    const type = character ? 'income' : 'expense';
    let totalMoney = this.walletStore.totalMoney();

    if(isTotalPay) {
      totalMoney -= amount;
      accountSelected[0]!.amount! += amount;
      accountSelected[1]!.amount! -= amount;
    }
    else {
      if( type === 'expense' ) {
        totalMoney -= (isCreditCard && !isDebitedCreditCard) ? 0 : amount;
        accountSelected[0]!.amount += isCreditCard ? amount : -amount;
      }
      else {
        totalMoney += (isCreditCard && !isDebitedCreditCard) ? 0 : amount;
        accountSelected[0]!.amount! += isCreditCard ? -amount : amount;
      }
    }


    let newsMovements: Movement[] = [];
    accountSelected.forEach( (account, i) => {
      newsMovements.push(
        {
          id: new Date().getTime().toString(),
          description,
          accountId: account.id,
          amount,
          character: (!isTotalPay || i === 1) ? type : "income",
          day: new Date(date)
        }
      )
    });

    this.walletStore.addMovement(totalMoney, newsMovements);
    this.form.reset();
    this.toastService.show('SUCCESS', 'Se registro el movimiento');
    this.router.navigateByUrl(PATH.ACCOUNTS);
  }
}
