import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [ RouterOutlet, NavMenuComponent, HeaderComponent ],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss'
})
export class WrapperComponent {
  // readonly user = this.userStore.state.asReadonly();
  // readonly wallet = this.walletStore.state.asReadonly();

  // public amountPerDay: Signal<number> = computed( () => this.wallet().money_per_day );
  // public amountSaving: Signal<number> = computed( () => this.wallet().money_saved[0].amount );
  // public amount: number = 0

  // constructor(
  //   private userStore: UserStore,
  //   private walletStore: WalletStore,
  // ) {
  //   this.effectMoney();
  // }

  // private effectMoney(): void {
  //   const digit = this.wallet()?.total_money?.toString().length;
  //   let increment: number;

  //   if(digit <= 3) increment = 12;
  //   else if(digit === 4) increment = 102;
  //   else if(digit === 5) increment = 1032;
  //   else if(digit === 6) increment = 5012;
  //   else increment = 15033;

  //   let time = setInterval(() => {
  //     this.amount += increment;

  //     if(this.amount >=  this.wallet().total_money) {
  //       this.amount =  this.wallet().total_money;
  //       clearInterval(time);
  //     }
  //   }, 1);
  // }

}
