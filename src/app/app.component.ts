import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';

import { UserStore } from './store/user-store.service';
import { WalletStore } from './store/wallet-store.service';
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
  private walletStore = inject(WalletStore);

  constructor() {
    this.setData();
  }

  private setData(): void {
    const token = localStorage.getItem('tokenMF');

    if(token) {
      const user = JSON.parse(localStorage.getItem('user:' + token)!);
      this.userStore.setId(token);
      this.userStore.setSignal(user);

      const wallet = JSON.parse(localStorage.getItem('wallet:' + token)!);
      if(wallet) {
        this.walletStore.setSignal(wallet);
      } else {
        this.walletStore.intialWallet(token);
      }
    }
  }
}
