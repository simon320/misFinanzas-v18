import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';

import { UserStore } from './user-store.service';
import { Account, Wallet } from '../common/interfaces/interface';

@Injectable({ providedIn: 'root' })
export class WalletStore {
  private userStore = inject(UserStore);

  private intialState: Wallet = {
    userId: '',
    total_money: 0,
    money_saved: [],
    money_per_day: 0,
    start_selected_day: '',
    end_selected_day: '',
    movement: [],
    days: [],
    accounts: []
  };
  private walletSignal = signal<Wallet>(this.intialState);

  constructor() {
    this.update();
  }

  private update(): void {
    effect(()=> {
      const wallet = this.walletSignal;

      if(wallet().userId !== '') {
        const key = 'wallet:' + this.userStore.getId();
        localStorage.setItem(key, JSON.stringify( this.walletSignal() ));
      }
    });
  }


  public intialWallet(id: string): void{
    this.setSignal({...this.intialState, userId: id});
  }

  public setPartialState(partialState: Partial<Wallet>): void {
    this.walletSignal.update((currentValue) => ({ ...currentValue, ...partialState }));
  }

  public setSignal(wallet: Wallet): void {
    this.walletSignal.set(wallet);
  }

  public getSignal(): Signal<Wallet>{
    return computed(() => this.walletSignal());
  }

  public addAccount(account: Account): void {
    let accounts: Account[] = this.walletSignal().accounts;
    accounts.push(account);

    if(account.type !== 'Tarjeta de Credito')
      this.setPartialState({
        accounts: accounts,
        total_money: (this.walletSignal().total_money + account.amount!)
      });

    else
      this.setPartialState({ accounts: accounts });
  }

}
