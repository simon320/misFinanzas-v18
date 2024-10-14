import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PATH } from '../../common/enums/enum';
import { Account } from '../../common/interfaces/interface';
import { WalletStore } from '../../store/wallet.store';
import { ToastService } from '../../common/components/toast/toast.service';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss'
})
export class AddAccountComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  readonly walletStore = inject(WalletStore);
  private toastService = inject(ToastService);

  public form!: FormGroup;
  public accounts: Account[] = [
    { type: 'Cuenta Bancaria' },
    { type: 'Cuenta App' },
    { type: 'Tarjeta de Credito' },
    { type: 'Fondo de Inversion' },
    { type: 'Dinero en Efectivo' },
    { type: 'Otro' }
  ];


  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      typeAccount: [this.accounts[0].type, Validators.required],
      name: ['', Validators.required],
      amount: [],
    })
  }

  private getDataOfForm(): Account | null {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const { typeAccount, amount, name } = this.form.value;
    const newAccount: Account = {
      id: new Date().getTime().toString(),
      name,
      type: typeAccount,
      amount: amount ? amount : 0,
      movements: [],
      debit: false
    }

    return newAccount;
  }

  public addAccount(): void {
    this.walletStore.addAccount(this.getDataOfForm()!);
    this.form.reset();
    this.toastService.show('SUCCESS', 'Cuenta creada con exito');
    this.router.navigateByUrl(PATH.ACCOUNTS);
  }

}
