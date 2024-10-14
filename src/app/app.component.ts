import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';

import { STORAGE } from './common/enums/enum';
import { UserStore } from './store/user.store';
import { DayService } from './store/day.service';
import { WalletStore } from './store/wallet.store';
import { ToastComponent } from './common/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private userStore = inject(UserStore);
  private dayService = inject(DayService);
  readonly walletStore = inject(WalletStore);


  constructor() {
    this.setData();
    this.decideExecute();
  }


  private setData(): void {
    const token = localStorage.getItem('tokenMF');

    if(token) {
      const user = JSON.parse(localStorage.getItem('user:' + token)!);
      this.userStore.setUserId(token);
      this.userStore.setUser(user);

      const wallet = JSON.parse(localStorage.getItem('wallet:' + token)!);
      if(wallet) {
        this.walletStore.setWallet( wallet );
      } else {
        this.walletStore.setUserId(token);
      }
    }
  }


  private decideExecute(): void {
    localStorage.getItem(STORAGE.AMOUNT_PER_DAY) ? this.dayService.compareDate() : this.dayService.updateAmountPerDay();
  }

}
